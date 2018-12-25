(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["colour-card.html"] = (function() {
function root(env, context, frame, runtime, cb) {
var lineno = null;
var colno = null;
var output = "";
try {
var parentTemplate = null;
output += "<div class=\"colour-cards__item ";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "colourCard")),"additionalClasses"), env.opts.autoescape);
output += "\" style=\"background-color: ";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "colourCard")),"bgColour"), env.opts.autoescape);
output += "; color: ";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "colourCard")),"textColour"), env.opts.autoescape);
output += "\">\n\t<p>";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "colourCard")),"textColour"), env.opts.autoescape);
output += "</p>\n\t<p>The quick brown fox jumps over the lazy dog</p>\n\t<p>bg: ";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "colourCard")),"bgColour"), env.opts.autoescape);
output += "</p>\n\t<p>";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "colourCard")),"contrastRatio"), env.opts.autoescape);
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
