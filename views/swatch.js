(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["swatch.html"] = (function() {
function root(env, context, frame, runtime, cb) {
var lineno = null;
var colno = null;
var output = "";
try {
var parentTemplate = null;
output += "<div class=\"swatch__info\">\n\t<p class=\"switchable-info__item -hex\">";
output += runtime.suppressValue(runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "swatch")),"display")),"hex"), env.opts.autoescape);
output += "</p>\n\t<p class=\"switchable-info__item -hsl\">";
output += runtime.suppressValue(runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "swatch")),"display")),"hsl"), env.opts.autoescape);
output += "</p>\n\t<p class=\"switchable-info__item -rgb\">";
output += runtime.suppressValue(runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "swatch")),"display")),"rgb"), env.opts.autoescape);
output += "</p>\n\t<p class=\"switchable-info__item -hsv\">";
output += runtime.suppressValue(runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "swatch")),"display")),"hsv"), env.opts.autoescape);
output += "</p>\n\t<p class=\"swatch__contrast\">";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "swatch")),"contrastToWhite"), env.opts.autoescape);
output += "</p>\n</div>\n\n<div class=\"swatch__bg\" style=\"background-color: ";
output += runtime.suppressValue(runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "swatch")),"display")),"hex"), env.opts.autoescape);
output += ";\">\n</div>";
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
