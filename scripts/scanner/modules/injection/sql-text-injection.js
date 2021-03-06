var module = {
  name: "Blind SQL Text Injection Differential Checks",
  category: "Injection Modules",
  differential: true
};

function initialize(ctx) {
  
  var ps = ctx.getPathState();

  if (ps.isParametric()) {
    ctx.submitAlteredRequest(process, "\\'\\\"", true, 0);
    ctx.submitAlteredRequest(process, "'\"", true, 1);
    ctx.submitAlteredRequest(process, "\\\\'\\\\\"", true, 2);
    ctx.submitAlteredRequest(process, "''''\"\"\"\"", true, 3);
    ctx.submitAlteredRequest(process, "'\"'\"'\"'\"", true, 4);

    ctx.submitAlteredRequest(process, "' OR 1 = 1 -- ", true, 5);
    ctx.submitAlteredRequest(process, " OR 1=1 -- ", true, 6);
    ctx.submitAlteredRequest(process, "\" OR 1=1 -- ", true, 7);
    
    ctx.submitAlteredRequest(process, "' OR 1=2 -- ", true, 8);
    ctx.submitAlteredRequest(process, " OR 1=2 -- ", true, 9);
    ctx.submitAlteredRequest(process, "\" OR 1=2 -- ", true, 10);

    ctx.submitAlteredRequest(process, "'", true, 11);
    ctx.submitAlteredRequest(process, "\\'", true, 12);    
    ctx.submitAlteredRequest(process, "''", true, 13);
    
    ctx.submitAlteredRequest(process, "' UNION SELECT 8, table_name, 'vega' FROM information_schema.taables WHERE taable_name like'%", true, 14);   
    ctx.submitAlteredRequest(process, "' UNION SELECT 8, table_name, 'vega' FROM information_schema.tables WHERE table_name like'%", true, 15);
    ctx.submitAlteredRequest(process, "\" UNION SELECT 8, table_name, 'vega' FROM information_schema.taables WHERE taable_name like'%", true, 16);
    ctx.submitAlteredRequest(process, "\" UNION SELECT 8, table_name, 'vega' FROM information_schema.tables WHERE table_name like'%", true, 17);

  }
  

}

function process(req, res, ctx) {

  if (ctx.hasModuleFailed()) return;


  if (res.fetchFail) {	
    ctx.error(req, res, "During SQL injection checks");
    ctx.setModuleFailed();
    return;
  }

  ctx.addRequestResponse(req, res);
  
  var n = ctx.incrementResponseCount();
  
  if (n < 18) return;
  
  var ps = ctx.getPathState();
  var fp = ps.getPathFingerprint();
  
  if (!ctx.isFingerprintMatch(0, 1) && !ctx.isFingerprintMatch(1, 2)) {
	  var uri = String(ctx.getSavedRequest(1).requestLine.uri);
	  var uripart = uri.replace(/\?.*/, "");
	  ctx.alert("vinfo-sql-inject", ctx.getSavedRequest(1), ctx.getSavedResponse(1), {
      output: ctx.getSavedResponse(1).bodyAsString,
      key: "vinfo-sql-inject:" + uripart + ":" + ps.getFuzzableParameter().name,
      resource: uripart,
      detectiontype: "Blind Text Injection Differential"
    });

    ctx.responseChecks(0);
    ctx.responseChecks(2);
  }
  
  if (ctx.isFingerprintMatch(1, 4) && !ctx.isFingerprintMatch(3, 4)) {
	  var uri = String(ctx.getSavedRequest(1).requestLine.uri);
	  var uripart = uri.replace(/\?.*/, "");
	  ctx.alert("vinfo-sql-inject", ctx.getSavedRequest(1), ctx.getSavedResponse(1), {
      output: ctx.getSavedResponse(1).bodyAsString,
      key: "vinfo-sql-inject:" + uripart + ":" + ps.getFuzzableParameter().name,
      resource: uripart,
      detectiontype: "Blind Text Injection Differential"
    });
    ctx.responseChecks(3);
    ctx.responseChecks(4);
  }
  
  if (ctx.isFingerprintMatch(12, 13) && !ctx.isFingerprintMatch(11, 12)) {
	  var uri = String(ctx.getSavedRequest(1).requestLine.uri);
	  var uripart = uri.replace(/\?.*/, "");
	  ctx.alert("vinfo-sql-inject", ctx.getSavedRequest(1), ctx.getSavedResponse(1), {
      output: ctx.getSavedResponse(1).bodyAsString,
      key: "vinfo-sql-inject:" + uripart + ":" + ps.getFuzzableParameter().name,
      resource: uripart,
      detectiontype: "Blind Text Injection Differential"
    });
    ctx.responseChecks(12);
    ctx.responseChecks(13);
  }  

  if (ctx.isFingerprintMatch(14, fp) && !ctx.isFingerprintMatch(14, 15)) {
	  var uri = String(ctx.getSavedRequest(1).requestLine.uri);
	  var uripart = uri.replace(/\?.*/, "");
	  ctx.alert("vinfo-sql-inject", ctx.getSavedRequest(15), ctx.getSavedResponse(15), {
      output: ctx.getSavedResponse(1).bodyAsString,
      key: "vinfo-sql-inject:" + uripart + ":" + ps.getFuzzableParameter().name,
      resource: uripart,
      detectiontype: "Blind Text Injection Differential"
    });
    ctx.responseChecks(15);
  }  
  
  if (ctx.isFingerprintMatch(16, fp) && !ctx.isFingerprintMatch(17, 16)) {
	  var uri = String(ctx.getSavedRequest(1).requestLine.uri);
	  var uripart = uri.replace(/\?.*/, "");
	  ctx.alert("vinfo-sql-inject", ctx.getSavedRequest(16), ctx.getSavedResponse(16), {
      output: ctx.getSavedResponse(1).bodyAsString,
      key: "vinfo-sql-inject:" + uripart + ":" + ps.getFuzzableParameter().name,
      resource: uripart,
      detectiontype: "Blind Text Injection Differential"
    });
    ctx.responseChecks(16);
  }  
}
