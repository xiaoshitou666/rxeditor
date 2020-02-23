export class IFrameCommandProxy{
  constructor(workspaceFrame){
    this.workspaceFrame = workspaceFrame
    //this.waitingAccembles = {}
    window.addEventListener("message", (event)=>{
        this.handleMessage(event.data);
    });
  }

  endDragFromToolbox(){
    this.sendMessageToRXEditor({
      name:'endDragFromToolbox'
    })
  }

  draggingFromToolbox(rxNameId){
    this.sendMessageToRXEditor({
      name:'draggingFromToolbox',
      rxNameId:rxNameId
    })
  }

  changeCanvasState(state){
    this.sendMessageToRXEditor({
      name : 'changeCanvasState',
      state : {
        screenWidth : state.screenWidth,
        preview : state.preview,
        showEditMargin : state.showEditMargin,
        showOutline : state.showOutline,
        showLabel : state.showLabel,
      }
    })
  }

  nodeChanged(node){
    this.sendMessageToRXEditor({
      name:'nodeChanged',
      node:node
    })
  }

  redo(){
    this.sendMessageToRXEditor({
      name:'redo'
    })
  }

  undo(){
    this.sendMessageToRXEditor({
      name:'undo'
    })
  }

  download(){
    this.sendMessageToRXEditor({
      name:'download'
    })
  }

  clearCanvas(){
    this.sendMessageToRXEditor({
      name:'clearCanvas'
    })
  }

  changeTheme(theme){
    this.sendMessageToRXEditor({
      name:'changeTheme',
      theme:theme,
    })
  }

  handleMessage(message){
    switch (message.name) {
      case 'rxeditorReady':
        this.serveForShell.onRxEditorReady()
        break;
      case 'replyAssemble':
        //let rxNameId = message.toolboxInfo.rxNameId
        this.waitingAccemble(message.toolbox)
        break;
      case 'takeOverDraggingByWorkspace':
        this.serveForShell.endFollowMouse()
        break;
      case 'focusNode':
        this.serveForShell.focusNode(message.node)
        break;
      case 'unFocusNode':
        this.serveForShell.unFocusNode(message.id)
        break;
      case 'commandsHistoryChanged':
        this.serveForShell.commandsHistoryChanged(message.canUndo, message.canRedo)
        break;
      case 'saveCodeFiles':
        this.serveForShell.saveCodeFiles(message.innerHTML, message.json)
        break;
    }
  }

  requestAssemble(theme, replyFunction){
    this.waitingAccemble = replyFunction
    this.sendMessageToRXEditor({
      name: 'requestAssemble',
      theme: theme,
    })
  }


  sendMessageToRXEditor(message){
    let iframe = this.workspaceFrame;
    if(iframe){
      iframe.contentWindow.postMessage(message, '/')
      window.postMessage(message, '/');    
    }
  }


}