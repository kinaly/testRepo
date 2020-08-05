(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["swatch-radio.html"] = (function() {
function root(env, context, frame, runtime, cb) {
var lineno = 0;
var colno = 0;
var output = "";
try {
var parentTemplate = null;
output += "<label class=\"swatch-radio\">\n\t<input type=\"radio\" name=\"";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "swatch")),"radioName"), env.opts.autoescape);
output += "\" class=\"swatch-radio__input\" data-colour=\"";
output += runtime.suppressValue(runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "swatch")),"display")),"hex"), env.opts.autoescape);
output += "\">\n\t<span class=\"swatch-radio__label\" style=\"background-color: ";
output += runtime.suppressValue(runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "swatch")),"display")),"hex"), env.opts.autoescape);
output += "; background-image: ";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "swatch")),"cssGradient"), env.opts.autoescape);
output += "\">AaBbCc</span>\n</label>";
if(parentTemplate) {
parentTemplate.rootRenderFunc(env, context, frame, runtime, cb);
} else {
cb(null, output);
}
;
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
return {
root: root
};

})();
})();
