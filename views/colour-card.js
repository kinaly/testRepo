(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["colour-card.html"] = (function() {
function root(env, context, frame, runtime, cb) {
var lineno = 0;
var colno = 0;
var output = "";
try {
var parentTemplate = null;
output += "<div class=\"colour-cards__item ";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "colourCard")),"additionalClasses"), env.opts.autoescape);
output += "\" style=\"background-color: ";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "colourCard")),"bgColour"), env.opts.autoescape);
output += "; color: ";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "colourCard")),"textColour"), env.opts.autoescape);
output += "\">\n\t<p class=\"colour-cards__info-label\">Text</p>\n\t<p class=\"colour-cards__heading\">";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "colourCard")),"textColour"), env.opts.autoescape);
output += "</p>\n\t\n\t<p class=\"colour-cards__info-label\">Background</p>\n\t<p class=\"colour-cards__subheading\">";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "colourCard")),"bgColour"), env.opts.autoescape);
output += "</p>\n\t\n\t<p class=\"colour-cards__sample\">The quick brown fox jumps over the lazy dog</p>\n\n\t<p class=\"u-mb-none\">";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "colourCard")),"contrastRating"), env.opts.autoescape);
output += "</p>\n\t<small>";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "colourCard")),"contrastRatio"), env.opts.autoescape);
output += "</small>\n</div>";
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
