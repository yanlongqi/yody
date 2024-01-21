import { findLast } from 'lodash'
import type * as vscode from 'vscode'

import {
    errorToChatError,
    reformatBotMessageForChat,
    type ChatError,
    type ChatMessage,
    type ContextFileSource,
    type InteractionJSON,
    type InteractionMessage,
    type Message,
    type TranscriptJSON,
} from '@sourcegraph/cody-shared'

import { contextItemsToContextFiles } from './chat-helpers'

export interface MessageWithContext {
    message: Message

    // If set, this should be used as the display text for the message.
    // Do not access directly, prefer using the getDisplayText function
    // instead.
    displayText?: string

    // The additional context items attached to this message (which should not
    // duplicate any previous context items in the transcript). This should
    // only be defined on human messages.
    newContextUsed?: ContextItem[]

    error?: ChatError
}

export class SimpleChatModel {
    constructor(
        public modelID: string,
        private messagesWithContext: MessageWithContext[] = [],
        public readonly sessionID: string = new Date(Date.now()).toUTCString(),
        public chatTitle?: string
    ) {}

    public isEmpty(): boolean {
        return this.messagesWithContext.length === 0
    }

    public setNewContextUsed(newContextUsed: ContextItem[]): void {
        const lastMessage = this.messagesWithContext.at(-1)
        if (!lastMessage) {
            throw new Error('no last message')
        }
        if (lastMessage.message.speaker !== 'human') {
            throw new Error('Cannot set new context used for bot message')
        }
        lastMessage.newContextUsed = newContextUsed
    }

    public addHumanMessage(message: Omit<Message, 'speaker'>, displayText?: string): void {
        if (this.messagesWithContext.at(-1)?.message.speaker === 'human') {
            throw new Error('Cannot add a user message after a user message')
        }
        this.messagesWithContext.push({
            displayText,
            message: {
                ...message,
                speaker: 'human',
            },
        })
    }

    public addBotMessage(message: Omit<Message, 'speaker'>, displayText?: string): void {
        const lastMessage = this.messagesWithContext.at(-1)?.message
        let error: any
        // If there is no text, it could be a placeholder message for an error
        if (lastMessage?.speaker === 'assistant') {
            if (lastMessage?.text) {
                throw new Error('Cannot add a bot message after a bot message')
            }
            error = this.messagesWithContext.pop()?.error
        }
        this.messagesWithContext.push({
            displayText,
            error,
            message: {
                ...message,
                speaker: 'assistant',
            },
        })
    }

    public addErrorAsBotMessage(error: Error): void {
        const lastMessage = this.messagesWithContext.at(-1)?.message
        // Remove the last assistant message if any
        const lastAssistantMessage =
            lastMessage?.speaker === 'assistant' && this.messagesWithContext.pop()
        const assistantMessage = lastAssistantMessage || { speaker: 'assistant' }
        // Then add a new assistant message with error added
        this.messagesWithContext.push({
            error: errorToChatError(error),
            message: {
                ...assistantMessage,
                speaker: 'assistant',
            },
        })
    }

    public getLastHumanMessage(): MessageWithContext | undefined {
        return findLast(this.messagesWithContext, message => message.message.speaker === 'human')
    }

    public updateLastHumanMessage(message: Omit<Message, 'speaker'>, displayText?: string): void {
        const lastMessage = this.messagesWithContext.at(-1)
        if (!lastMessage) {
            return
        }
        if (lastMessage.message.speaker === 'human') {
            this.messagesWithContext.pop()
        } else if (lastMessage.message.speaker === 'assistant') {
            this.messagesWithContext.splice(-2, 2)
        }
        this.addHumanMessage(message, displayText)
    }

    public getMessagesWithContext(): MessageWithContext[] {
        return this.messagesWithContext
    }

    public setChatTitle(title: string): void {
        this.chatTitle = title
    }

    /**
     * Serializes to the legacy transcript JSON format
     */
    public toTranscriptJSON(): TranscriptJSON {
        const interactions: InteractionJSON[] = []
        for (let i = 0; i < this.messagesWithContext.length; i += 2) {
            const humanMessage = this.messagesWithContext[i]
            const botMessage = this.messagesWithContext[i + 1]
            interactions.push(messageToInteractionJSON(humanMessage, botMessage))
        }
        return {
            id: this.sessionID,
            chatModel: this.modelID,
            chatTitle: this.chatTitle,
            lastInteractionTimestamp: this.sessionID,
            interactions,
        }
    }
}

function messageToInteractionJSON(
    humanMessage: MessageWithContext,
    botMessage: MessageWithContext
): InteractionJSON {
    if (humanMessage?.message?.speaker !== 'human') {
        throw new Error('SimpleChatModel.toTranscriptJSON: expected human message, got bot')
    }
    return {
        humanMessage: messageToInteractionMessage(humanMessage),
        assistantMessage:
            botMessage?.message?.speaker === 'assistant'
                ? messageToInteractionMessage(botMessage)
                : { speaker: 'assistant' },
        usedContextFiles: contextItemsToContextFiles(humanMessage.newContextUsed ?? []),
        // These fields are unused on deserialization
        fullContext: [],
        usedPreciseContext: [],
        timestamp: new Date().toISOString(),
    }
}

function messageToInteractionMessage(message: MessageWithContext): InteractionMessage {
    return {
        speaker: message.message.speaker,
        text: message.message.text,
        displayText: getDisplayText(message),
    }
}

export interface ContextItem {
    uri: vscode.Uri
    range?: vscode.Range
    text: string
    source?: ContextFileSource
}

export function contextItemId(contextItem: ContextItem): string {
    return contextItem.range
        ? `${contextItem.uri.toString()}#${contextItem.range.start.line}:${contextItem.range.end.line}`
        : contextItem.uri.toString()
}

export function toViewMessage(mwc: MessageWithContext): ChatMessage {
    const displayText = getDisplayText(mwc)
    return {
        ...mwc.message,
        error: mwc.error,
        displayText,
        contextFiles: contextItemsToContextFiles(mwc.newContextUsed || []),
    }
}

function getDisplayText(mwc: MessageWithContext): string | undefined {
    if (mwc.displayText) {
        return mwc.displayText
    }
    if (mwc.message.speaker === 'assistant' && mwc.message.text) {
        return reformatBotMessageForChat(mwc.message.text, '')
    }
    return mwc.message.text
}
