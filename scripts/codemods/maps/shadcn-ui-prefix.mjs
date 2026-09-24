const T = "(^|[\\s\"'`:])";
const E = "(?=[\\s\"'`]|$)";
const util = "(text|bg|border|ring|fill|stroke|from|to|via|outline|decoration|placeholder|shadow)";
const name = "(primary|secondary|muted|accent)(-foreground)?";

const shadcnUiPrefixMap = {
  rules: [
    { match: new RegExp(`${T}${util}-${name}(\\/\\d+)?${E}`, "g"), replace: "$1$2-ui-$3$4$5" },
  ],
};

export default shadcnUiPrefixMap;
