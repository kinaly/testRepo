(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["swatch.html"] = (function() {
function root(env, context, frame, runtime, cb) {
var lineno = null;
var colno = null;
var output = "";
try {
var parentTemplate = null;
output += "<div class=\"swatch__bg\" style=\"background-color: ";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "swatch")),"hex"), env.opts.autoescape);
output += ";\">\n\t<p class=\"switchable-info__item -hex\">";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "swatch")),"hex"), env.opts.autoescape);
output += "</p>\n\t<p class=\"switchable-info__item -hsl\">hsl(";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "swatch")),"hue"), env.opts.autoescape);
output += ", ";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "swatch")),"saturation"), env.opts.autoescape);
output += ", ";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "swatch")),"luminosity"), env.opts.autoescape);
output += ")</p>\n\t<p class=\"switchable-info__item -hsv\">hsv(";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "swatch")),"hue2"), env.opts.autoescape);
output += ",";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "swatch")),"saturation2"), env.opts.autoescape);
output += ", ";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "swatch")),"value"), env.opts.autoescape);
output += ")</p>\n\t<p class=\"swatch__contrast\">";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "swatch")),"contrastToWhite"), env.opts.autoescape);
output += "</p>\n</div>";
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
