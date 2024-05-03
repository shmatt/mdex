/** Common utilities for extracting tags, links, and other business from metadata. */
import P from "parsimmon";

const EXPRESSION = P.createLanguage({
    tag: _ =>
        P.seqMap(
            P.string("#"),
            P.alt(P.regexp(/[^\u2000-\u206F\u2E00-\u2E7F'!"#$%&()*+,.:;<=>?@^`{|}~\[\]\\\s]/).desc("text")).many(),
            (start, rest) => start + rest.join("")
        ).desc("tag ('#hello/stuff')"),
});

const POTENTIAL_TAG_MATCHER = /#[^\s,;\.:!\?'"`()\[\]\{\}]+/giu;

/** Extract all tags from the given source string. */
export function extractTags(source: string): Set<string> {
    let result = new Set<string>();

    let matches = source.matchAll(POTENTIAL_TAG_MATCHER);
    for (let match of matches) {
        let parsed = EXPRESSION.tag.parse(match[0]);
        if (parsed.status) result.add(parsed.value);
    }

    return result;
}
