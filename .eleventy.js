module.exports = function (eleventyConfig) {

    eleventyConfig.addPassthroughCopy("src/games");
    eleventyConfig.addPassthroughCopy("src/icons");
    eleventyConfig.addPassthroughCopy("src/js");
    eleventyConfig.addPassthroughCopy("src/media");
    eleventyConfig.addPassthroughCopy("src/models");
    eleventyConfig.addPassthroughCopy("src/style.css");
    eleventyConfig.addPassthroughCopy("src/favicon.ico");
    eleventyConfig.addPassthroughCopy("src/LukeTResume.pdf");
    eleventyConfig.addPassthroughCopy("CNAME");
    

    eleventyConfig.addFilter("contains", (sub = "", parent = "") => {
        if (parent.length == 1 && sub != parent) return false
        return sub.includes(parent);
    });

    return {
        dir: {
            input: "src",
            output: "public"
        }
    }
}