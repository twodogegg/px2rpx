var hx = require("hbuilderx");
const diff = require("./diff.js")
//该方法将在插件激活的时候调用
function activate(context) {
    let disposable = hx.commands.registerCommand('extension.px2rpx', () => {
		let config = hx.workspace.getConfiguration();
		sets("close", "0","px2rpx开启成功！！！!")
        hx.workspace.onWillSaveTextDocument(function(event) {
			let close = config.get("close", false);
			if (Number.parseInt(close) > 0) {
				return false;
			}
            let doc = event.document;
            let text = doc.getText();
            	let newtext = text.replace(/(?<=\d+)px/g, 'rpx');
            	const diffs = diff.stringDiff(text, newtext, false);
            	let workspaceEdit = new hx.WorkspaceEdit();
            	let edits = [];
            	for (let df of diffs) {
            		edits.push(new hx.TextEdit({
            			start: df.originalStart,
            			end: df.originalStart + df.originalLength
            		}, newtext.substr(df.modifiedStart, df.modifiedLength)));
            	}
            	workspaceEdit.set(doc.uri, edits);
            	hx.workspace.applyEdit(workspaceEdit);
        });
    });
	hx.commands.registerCommand('extension.closePx2rpx', () => {
		sets("close", "1","px2rpx关闭成功!")
	});
	
	
    //订阅销毁钩子，插件禁用的时候，自动注销该command。
    context.subscriptions.push(disposable);
}
//该方法将在插件禁用的时候调用（目前是在插件卸载的时候触发）
function deactivate() {

}


/**
 * 设置配置,给予反馈
 * @description 设置配置,给予反馈
 * @param {Number} type 
 * @param {String} data
 * @param {String} desc 文字信息 
 */
function sets(type,data,desc){
	hx.workspace.getConfiguration().update(type, data)
		.then(() => {
			hx.window.showInformationMessage(desc)
		})
		.catch(() => {
			hx.window.showWarningMessage("设置失败!")
		});
}

module.exports = {
    activate,
    deactivate
}
