package com.sourcegraph.cody.chat;

import com.intellij.openapi.actionSystem.AnActionEvent;
import com.intellij.openapi.project.DumbAwareAction;
import com.intellij.openapi.project.Project;
import com.sourcegraph.cody.CodyToolWindowContent;
import com.sourcegraph.common.ErrorNotification;
import org.jetbrains.annotations.NotNull;

public class ResetCurrentConversationAction extends DumbAwareAction {

  @Override
  public void actionPerformed(@NotNull AnActionEvent e) {
    Project project = e.getProject();
    if (project == null) {
      displayUnableToResetConversationError();
      return;
    }
    CodyToolWindowContent.Companion.executeOnInstanceIfNotDisposed(
        project,
        codyToolWindowContent -> {
          codyToolWindowContent.resetConversation();
          return null;
        });
  }

  @Override
  public void update(@NotNull AnActionEvent e) {
    Project project = e.getProject();
    if (project != null) {
      CodyToolWindowContent.Companion.executeOnInstanceIfNotDisposed(
          project,
          codyToolWindowContent -> {
            e.getPresentation().setVisible(codyToolWindowContent.isChatVisible());
            return null;
          });
    }
  }

  private static void displayUnableToResetConversationError() {
    ErrorNotification.INSTANCE.show(
        null,
        "Unable to reset the current conversation with Cody. Please try again or reach out to us at support@sourcegraph.com.");
  }
}
