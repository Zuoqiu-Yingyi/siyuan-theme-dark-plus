// REF https://github.com/yzhang-gh/vscode-markdown/blob/master/src/completion.ts

import { getConf } from './api.js';
export {
    MdCompletionItemProvider,
};

const languages = window.monaco.languages;
const CompletionItemKind = languages.CompletionItemKind;

/**
 * A completion item represents a text snippet that is
 * proposed to complete text that is being typed.
 * REF [CompletionItem | Monaco Editor API](https://microsoft.github.io/monaco-editor/api/interfaces/monaco.languages.CompletionItem.html#additionalTextEdits)
 */
class CompletionItem {
    /**
     * The label of this completion item. By default
     * this is also the text that is inserted when selecting
     * this completion.
     */
    label;

    /**
     * The kind of this completion item. Based on the kind
     * an icon is chosen by the editor.
     */
    kind;

    /**
     * A string or snippet that should be inserted in a document when selecting
     * this completion.
     */
    insertText;
    constructor(label, kind) {
        this.label = label;
        this.kind = kind;
        this.insertTextRules = languages.CompletionItemInsertTextRule.InsertAsSnippet;
    }
}

function mathEnvCheck(doc, pos) {
    // const docText = doc.getText();
    const docText = doc.getValue();
    // const crtOffset = doc.offsetAt(pos);
    const crtOffset = doc.getOffsetAt(pos);
    // const crtLine = doc.lineAt(pos.line);
    const crtLine = doc.getLineContent(pos.lineNumber);

    // const lineTextBefore = crtLine.text.substring(0, pos.character);
    // const lineTextAfter = crtLine.text.substring(pos.character);
    const lineTextBefore = crtLine.substring(0, pos.column - 1);
    const lineTextAfter = crtLine.substring(pos.column - 1);
    // console.log(lineTextBefore);
    // console.log(lineTextAfter);

    if (
        // /(?:^|[^\$])\$(?:[^ \$].*)??\\\w*$/.test(lineTextBefore)
        /(?:^|[^\$])\$(?:[^ \$].*)??\\\w*$/.test(lineTextBefore)
        && lineTextAfter.includes("$")
    ) {
        // Inline math
        return "inline";
    } else {
        const textBefore = docText.substring(0, crtOffset);
        const textAfter = docText.substring(crtOffset);
        // console.log(textBefore);
        // console.log(textAfter);

        let matches = textBefore.match(/\$\$/g);
        if (matches !== null
            && matches.length % 2 !== 0
            && textAfter.includes("$$")) {
            // $$ ... $$
            return "display";
        } else {
            return null;
        }
    }
}

// REF [CompletionItemProvider | Monaco Editor API](https://microsoft.github.io/monaco-editor/api/interfaces/monaco.languages.CompletionItemProvider.html)
class MdCompletionItemProvider {

    //
    // Suffixes explained:
    // \cmd         -> 0
    // \cmd{$1}     -> 1
    // \cmd{$1}{$2} -> 2
    //
    // Use linebreak to mimic the structure of the KaTeX [Support Table](https://katex.org/docs/supported.html)
    // source https://github.com/KaTeX/KaTeX/blob/main/docs/supported.md
    //
    accents1 = [
        'tilde', 'mathring',
        'widetilde', 'overgroup',
        'utilde', 'undergroup',
        'acute', 'vec', 'Overrightarrow',
        'bar', 'overleftarrow', 'overrightarrow',
        'breve', 'underleftarrow', 'underrightarrow',
        'check', 'overleftharpoon', 'overrightharpoon',
        'dot', 'overleftrightarrow', 'overbrace',
        'ddot', 'underleftrightarrow', 'underbrace',
        'grave', 'overline', 'overlinesegment',
        'hat', 'underline', 'underlinesegment',
        'widehat', 'widecheck', 'underbar'
    ];
    delimiters0 = [
        'lparen', 'rparen', 'lceil', 'rceil', 'uparrow',
        'lbrack', 'rbrack', 'lfloor', 'rfloor', 'downarrow',
        'lbrace', 'rbrace', 'lmoustache', 'rmoustache', 'updownarrow',
        'langle', 'rangle', 'lgroup', 'rgroup', 'Uparrow',
        'vert', 'ulcorner', 'urcorner', 'Downarrow',
        'Vert', 'llcorner', 'lrcorner', 'Updownarrow',
        'lvert', 'rvert', 'lVert', 'rVert', 'backslash',
        'lang', 'rang', 'lt', 'gt', 'llbracket', 'rrbracket', 'lBrace', 'rBrace'
    ];
    delimeterSizing0 = [
        'left', 'big', 'bigl', 'bigm', 'bigr',
        'middle', 'Big', 'Bigl', 'Bigm', 'Bigr',
        'right', 'bigg', 'biggl', 'biggm', 'biggr',
        'Bigg', 'Biggl', 'Biggm', 'Biggr'
    ];
    greekLetters0 = [
        'Alpha', 'Beta', 'Gamma', 'Delta',
        'Epsilon', 'Zeta', 'Eta', 'Theta',
        'Iota', 'Kappa', 'Lambda', 'Mu',
        'Nu', 'Xi', 'Omicron', 'Pi',
        'Rho', 'Sigma', 'Tau', 'Upsilon',
        'Phi', 'Chi', 'Psi', 'Omega',
        'varGamma', 'varDelta', 'varTheta', 'varLambda',
        'varXi', 'varPi', 'varSigma', 'varUpsilon',
        'varPhi', 'varPsi', 'varOmega',
        'alpha', 'beta', 'gamma', 'delta',
        'epsilon', 'zeta', 'eta', 'theta',
        'iota', 'kappa', 'lambda', 'mu',
        'nu', 'xi', 'omicron', 'pi',
        'rho', 'sigma', 'tau', 'upsilon',
        'phi', 'chi', 'psi', 'omega',
        'varepsilon', 'varkappa', 'vartheta', 'thetasym',
        'varpi', 'varrho', 'varsigma', 'varphi',
        'digamma'
    ];
    otherLetters0 = [
        'imath', 'nabla', 'Im', 'Reals',
        'jmath', 'partial', 'image', 'wp',
        'aleph', 'Game', 'Bbbk', 'weierp',
        'alef', 'Finv', 'N', 'Z',
        'alefsym', 'cnums', 'natnums',
        'beth', 'Complex', 'R',
        'gimel', 'ell', 'Re',
        'daleth', 'hbar', 'real',
        'eth', 'hslash', 'reals'
    ];
    annotation1 = [
        'cancel', 'overbrace',
        'bcancel', 'underbrace',
        'xcancel', 'not =',
        'sout', 'boxed',
        'phase',
        'tag', 'tag*'
    ];
    verticalLayout0 = ['atop']
    verticalLayout1 = ['substack']
    verticalLayout2 = ['stackrel', 'overset', 'underset', 'raisebox'];
    overlap1 = ['mathllap', 'mathrlap', 'mathclap', 'llap', 'rlap', 'clap', 'smash'];
    spacing0 = [
        'thinspace', 'medspace', 'thickspace', 'enspace',
        'quad', 'qquad', 'negthinspace', 'negmedspace',
        'nobreakspace', 'negthickspace', 'space', 'mathstrut'
    ];
    spacing1 = [
        'kern', 'mkern', 'mskip', 'hskip',
        'hspace', 'hspace*', 'phantom', 'hphantom', 'vphantom'
    ];
    logicAndSetTheory0 = [
        'forall', 'complement', 'therefore', 'emptyset',
        'exists', 'subset', 'because', 'empty',
        'exist', 'supset', 'mapsto', 'varnothing',
        'nexists', 'mid', 'to', 'implies',
        'in', 'land', 'gets', 'impliedby',
        'isin', 'lor', 'leftrightarrow', 'iff',
        'notin', 'ni', 'notni', 'neg', 'lnot'
    ];
    macros0 = [
        'def', 'gdef', 'edef', 'xdef', 'let', 'futurelet', 'global',
        'newcommand', 'renewcommand', 'providecommand',
        'long', 'char', 'mathchoice', 'TextOrMath',
        '@ifstar', '@ifnextchar', '@firstoftwo', '@secondoftwo',
        'relax', 'expandafter', 'noexpand'
    ]
    bigOperators0 = [
        'sum', 'prod', 'bigotimes', 'bigvee',
        'int', 'coprod', 'bigoplus', 'bigwedge',
        'iint', 'intop', 'bigodot', 'bigcap',
        'iiint', 'smallint', 'biguplus', 'bigcup',
        'oint', 'oiint', 'oiiint', 'bigsqcup'
    ];
    binaryOperators0 = [
        'cdot', 'gtrdot', 'pmod',
        'cdotp', 'intercal', 'pod',
        'centerdot', 'land', 'rhd',
        'circ', 'leftthreetimes', 'rightthreetimes',
        'amalg', 'circledast', 'ldotp', 'rtimes',
        'And', 'circledcirc', 'lor', 'setminus',
        'ast', 'circleddash', 'lessdot', 'smallsetminus',
        'barwedge', 'Cup', 'lhd', 'sqcap',
        'bigcirc', 'cup', 'ltimes', 'sqcup',
        'bmod', 'curlyvee', 'times',
        'boxdot', 'curlywedge', 'mp', 'unlhd',
        'boxminus', 'div', 'odot', 'unrhd',
        'boxplus', 'divideontimes', 'ominus', 'uplus',
        'boxtimes', 'dotplus', 'oplus', 'vee',
        'bullet', 'doublebarwedge', 'otimes', 'veebar',
        'Cap', 'doublecap', 'oslash', 'wedge',
        'cap', 'doublecup', 'pm', 'plusmn', 'wr'
    ];
    fractions0 = ['over', 'above'];
    fractions2 = ['frac', 'dfrac', 'tfrac', 'cfrac', 'genfrac'];
    binomialCoefficients0 = ['choose'];
    binomialCoefficients2 = ['binom', 'dbinom', 'tbinom', 'brace', 'brack'];
    mathOperators0 = [
        'arcsin', 'cosec', 'deg', 'sec',
        'arccos', 'cosh', 'dim', 'sin',
        'arctan', 'cot', 'exp', 'sinh',
        'arctg', 'cotg', 'hom', 'sh',
        'arcctg', 'coth', 'ker', 'tan',
        'arg', 'csc', 'lg', 'tanh',
        'ch', 'ctg', 'ln', 'tg',
        'cos', 'cth', 'log', 'th',
        'argmax', 'injlim', 'min', 'varinjlim',
        'argmin', 'lim', 'plim', 'varliminf',
        'det', 'liminf', 'Pr', 'varlimsup',
        'gcd', 'limsup', 'projlim', 'varprojlim',
        'inf', 'max', 'sup'
    ];
    mathOperators1 = ['operatorname', 'operatorname*', 'operatornamewithlimits'];
    sqrt1 = ['sqrt'];
    relations0 = [
        'doteqdot', 'lessapprox', 'smile',
        'eqcirc', 'lesseqgtr', 'sqsubset',
        'eqcolon', 'minuscolon', 'lesseqqgtr', 'sqsubseteq',
        'Eqcolon', 'minuscoloncolon', 'lessgtr', 'sqsupset',
        'approx', 'eqqcolon', 'equalscolon', 'lesssim', 'sqsupseteq',
        'approxcolon', 'Eqqcolon', 'equalscoloncolon', 'll', 'Subset',
        'approxcoloncolon', 'eqsim', 'lll', 'subset', 'sub',
        'approxeq', 'eqslantgtr', 'llless', 'subseteq', 'sube',
        'asymp', 'eqslantless', 'lt', 'subseteqq',
        'backepsilon', 'equiv', 'mid', 'succ',
        'backsim', 'fallingdotseq', 'models', 'succapprox',
        'backsimeq', 'frown', 'multimap', 'succcurlyeq',
        'between', 'ge', 'origof', 'succeq',
        'bowtie', 'geq', 'owns', 'succsim',
        'bumpeq', 'geqq', 'parallel', 'Supset',
        'Bumpeq', 'geqslant', 'perp', 'supset',
        'circeq', 'gg', 'pitchfork', 'supseteq', 'supe',
        'colonapprox', 'ggg', 'prec', 'supseteqq',
        'Colonapprox', 'coloncolonapprox', 'gggtr', 'precapprox', 'thickapprox',
        'coloneq', 'colonminus', 'gt', 'preccurlyeq', 'thicksim',
        'Coloneq', 'coloncolonminus', 'gtrapprox', 'preceq', 'trianglelefteq',
        'coloneqq', 'colonequals', 'gtreqless', 'precsim', 'triangleq',
        'Coloneqq', 'coloncolonequals', 'gtreqqless', 'propto', 'trianglerighteq',
        'colonsim', 'gtrless', 'risingdotseq', 'varpropto',
        'Colonsim', 'coloncolonsim', 'gtrsim', 'shortmid', 'vartriangle',
        'cong', 'imageof', 'shortparallel', 'vartriangleleft',
        'curlyeqprec', 'in', 'isin', 'sim', 'vartriangleright',
        'curlyeqsucc', 'Join', 'simcolon', 'vcentcolon', 'ratio',
        'dashv', 'le', 'simcoloncolon', 'vdash',
        'dblcolon', 'coloncolon', 'leq', 'simeq', 'vDash',
        'doteq', 'leqq', 'smallfrown', 'Vdash',
        'Doteq', 'leqslant', 'smallsmile', 'Vvdash',
    ];
    negatedRelations0 = [
        'gnapprox', 'ngeqslant', 'nsubseteq', 'precneqq',
        'gneq', 'ngtr', 'nsubseteqq', 'precnsim',
        'gneqq', 'nleq', 'nsucc', 'subsetneq',
        'gnsim', 'nleqq', 'nsucceq', 'subsetneqq',
        'gvertneqq', 'nleqslant', 'nsupseteq', 'succnapprox',
        'lnapprox', 'nless', 'nsupseteqq', 'succneqq',
        'lneq', 'nmid', 'ntriangleleft', 'succnsim',
        'lneqq', 'notin', 'ntrianglelefteq', 'supsetneq',
        'lnsim', 'notni', 'ntriangleright', 'supsetneqq',
        'lvertneqq', 'nparallel', 'ntrianglerighteq', 'varsubsetneq',
        'ncong', 'nprec', 'nvdash', 'varsubsetneqq',
        'ne', 'npreceq', 'nvDash', 'varsupsetneq',
        'neq', 'nshortmid', 'nVDash', 'varsupsetneqq',
        'ngeq', 'nshortparallel', 'nVdash',
        'ngeqq', 'nsim', 'precnapprox'
    ];
    arrows0 = [
        'circlearrowleft', 'leftharpoonup', 'rArr',
        'circlearrowright', 'leftleftarrows', 'rarr',
        'curvearrowleft', 'leftrightarrow', 'restriction',
        'curvearrowright', 'Leftrightarrow', 'rightarrow',
        'Darr', 'leftrightarrows', 'Rightarrow',
        'dArr', 'leftrightharpoons', 'rightarrowtail',
        'darr', 'leftrightsquigarrow', 'rightharpoondown',
        'dashleftarrow', 'Lleftarrow', 'rightharpoonup',
        'dashrightarrow', 'longleftarrow', 'rightleftarrows',
        'downarrow', 'Longleftarrow', 'rightleftharpoons',
        'Downarrow', 'longleftrightarrow', 'rightrightarrows',
        'downdownarrows', 'Longleftrightarrow', 'rightsquigarrow',
        'downharpoonleft', 'longmapsto', 'Rrightarrow',
        'downharpoonright', 'longrightarrow', 'Rsh',
        'gets', 'Longrightarrow', 'searrow',
        'Harr', 'looparrowleft', 'swarrow',
        'hArr', 'looparrowright', 'to',
        'harr', 'Lrarr', 'twoheadleftarrow',
        'hookleftarrow', 'lrArr', 'twoheadrightarrow',
        'hookrightarrow', 'lrarr', 'Uarr',
        'iff', 'Lsh', 'uArr',
        'impliedby', 'mapsto', 'uarr',
        'implies', 'nearrow', 'uparrow',
        'Larr', 'nleftarrow', 'Uparrow',
        'lArr', 'nLeftarrow', 'updownarrow',
        'larr', 'nleftrightarrow', 'Updownarrow',
        'leadsto', 'nLeftrightarrow', 'upharpoonleft',
        'leftarrow', 'nrightarrow', 'upharpoonright',
        'Leftarrow', 'nRightarrow', 'upuparrows',
        'leftarrowtail', 'nwarrow', 'leftharpoondown', 'Rarr'
    ];
    extensibleArrows1 = [
        'xleftarrow', 'xrightarrow',
        'xLeftarrow', 'xRightarrow',
        'xleftrightarrow', 'xLeftrightarrow',
        'xhookleftarrow', 'xhookrightarrow',
        'xtwoheadleftarrow', 'xtwoheadrightarrow',
        'xleftharpoonup', 'xrightharpoonup',
        'xleftharpoondown', 'xrightharpoondown',
        'xleftrightharpoons', 'xrightleftharpoons',
        'xtofrom', 'xmapsto',
        'xlongequal'
    ];
    braketNotation1 = ['bra', 'Bra', 'ket', 'Ket', 'braket']
    classAssignment1 = [
        'mathbin', 'mathclose', 'mathinner', 'mathop',
        'mathopen', 'mathord', 'mathpunct', 'mathrel'
    ];
    color2 = ['color', 'textcolor', 'colorbox'];
    font0 = ['rm', 'bf', 'it', 'sf', 'tt'];
    font1 = [
        'mathrm', 'mathbf', 'mathit',
        'mathnormal', 'textbf', 'textit',
        'textrm', 'bold', 'Bbb',
        'textnormal', 'boldsymbol', 'mathbb',
        'text', 'bm', 'frak',
        'mathsf', 'mathtt', 'mathfrak',
        'textsf', 'texttt', 'mathcal', 'mathscr',
        'pmb'
    ];
    size0 = [
        'Huge', 'huge', 'LARGE', 'Large', 'large',
        'normalsize', 'small', 'footnotesize', 'scriptsize', 'tiny'
    ];
    style0 = [
        'displaystyle', 'textstyle', 'scriptstyle', 'scriptscriptstyle',
        'limits', 'nolimits', 'verb'
    ];
    symbolsAndPunctuation0 = [
        'cdots', 'LaTeX',
        'ddots', 'TeX',
        'ldots', 'nabla',
        'vdots', 'infty',
        'dotsb', 'infin',
        'dotsc', 'checkmark',
        'dotsi', 'dag',
        'dotsm', 'dagger',
        'dotso',
        'sdot', 'ddag',
        'mathellipsis', 'ddagger',
        'Box', 'Dagger',
        'lq', 'square', 'angle',
        'blacksquare', 'measuredangle',
        'rq', 'triangle', 'sphericalangle',
        'triangledown', 'top',
        'triangleleft', 'bot',
        'triangleright',
        'colon', 'bigtriangledown',
        'backprime', 'bigtriangleup', 'pounds',
        'prime', 'blacktriangle', 'mathsterling',
        'blacktriangledown',
        'blacktriangleleft', 'yen',
        'blacktriangleright', 'surd',
        'diamond', 'degree',
        'Diamond',
        'lozenge', 'mho',
        'blacklozenge', 'diagdown',
        'star', 'diagup',
        'bigstar', 'flat',
        'clubsuit', 'natural',
        'copyright', 'clubs', 'sharp',
        'circledR', 'diamondsuit', 'heartsuit',
        'diamonds', 'hearts',
        'circledS', 'spadesuit', 'spades',
        'maltese', 'minuso'
    ];
    debugging0 = ['message', 'errmessage', 'show']
    envs = [
        'matrix', 'array',
        'pmatrix', 'bmatrix',
        'vmatrix', 'Vmatrix',
        'Bmatrix',
        'cases', 'rcases',
        'smallmatrix', 'subarray',
        'equation', 'split', 'align',
        'gather', 'alignat',
        'CD',
        'darray', 'dcases', 'drcases',
        'matrix*', 'pmatrix*', 'bmatrix*',
        'Bmatrix*', 'vmatrix*', 'Vmatrix*',
        'equation*', 'gather*', 'align*', 'alignat*',
        'gathered', 'aligned', 'alignedat'
    ]

    mathCompletions = [];
    triggerCharacters = [
        '\\',
    ];
    mathCompletionsJSON;
    suggestions = () => JSON.parse(this.mathCompletionsJSON);

    constructor() {
        // \cmd
        let c1 = Array.from(new Set(
            [
                ...this.delimiters0, ...this.delimeterSizing0,
                ...this.greekLetters0, ...this.otherLetters0,
                ...this.spacing0, ...this.verticalLayout0,
                ...this.logicAndSetTheory0, ...this.macros0, ...this.bigOperators0,
                ...this.binaryOperators0, ...this.binomialCoefficients0,
                ...this.fractions0, ...this.mathOperators0,
                ...this.relations0, ...this.negatedRelations0,
                ...this.arrows0, ...this.font0, ...this.size0,
                ...this.style0, ...this.symbolsAndPunctuation0,
                ...this.debugging0
            ]
        )).map(cmd => {
            let item = new CompletionItem('\\' + cmd, CompletionItemKind.Function);
            item.insertText = cmd;
            return item;
        });
        // \cmd{$1}
        let c2 = Array.from(new Set(
            [
                ...this.accents1, ...this.annotation1,
                ...this.verticalLayout1, ...this.overlap1, ...this.spacing1,
                ...this.mathOperators1, ...this.sqrt1,
                ...this.extensibleArrows1, ...this.font1,
                ...this.braketNotation1, ...this.classAssignment1
            ]
        )).map(cmd => {
            let item = new CompletionItem('\\' + cmd, CompletionItemKind.Function);
            // [Has SnippetString been removed? · Issue #1454 · microsoft/monaco-editor · GitHub](https://github.com/microsoft/monaco-editor/issues/1454)
            // item.insertText = new SnippetString(`${cmd}\{$1\}`);
            item.insertText = `${cmd}\{$1\}`;
            return item;
        });
        // \cmd{$1}{$2}
        let c3 = Array.from(new Set(
            [
                ...this.verticalLayout2, ...this.binomialCoefficients2,
                ...this.fractions2, ...this.color2
            ]
        )).map(cmd => {
            let item = new CompletionItem('\\' + cmd, CompletionItemKind.Function);
            // item.insertText = new SnippetString(`${cmd}\{$1\}\{$2\}`);
            item.insertText = `${cmd}\{$1\}\{$2\}`;
            return item;
        });
        let envSnippet = new CompletionItem('\\begin', CompletionItemKind.Snippet);
        // envSnippet.insertText = new SnippetString('begin{${1|' + this.envs.join(',') + '|}}\n\t$2\n\\end{$1}');
        envSnippet.insertText = `begin{\${1|${this.envs.join(',')}|}}\n\t$2\n\\end{$1}`;

        // Import macros from configurations
        var macroItems = [];
        getConf().then(response => {
            if (response && response.code === 0) {
                const configMacros = JSON.parse(response.data.conf.editor?.katexMacros) ?? {};
                for (const [cmd, expansion] of Object.entries(configMacros)) {
                    let item = new CompletionItem(cmd, CompletionItemKind.Function);

                    // Find the number of arguments in the expansion
                    let numArgs = 0;
                    for (let i = 1; i < 10; i++) {
                        if (!expansion.includes(`#${i}`)) {
                            numArgs = i - 1;
                            break;
                        }
                    }

                    // item.insertText = new SnippetString(cmd.slice(1) + [...Array(numArgs).keys()].map(i => `\{$${i + 1}\}`).join(""));
                    item.insertText = cmd.slice(1) + [...Array(numArgs).keys()].map(i => `\{$${i + 1}\}`).join("");
                    console.log(item.insertText);
                    macroItems.push(item);
                }
            }
        }).finally(() => {
            this.mathCompletions = [
                ...c1,
                ...c2,
                ...c3,
                envSnippet,
                ...macroItems,
            ];

            // Sort
            for (const item of this.mathCompletions) {
                const label = typeof item.label === "string" ? item.label : item.label.label;
                item.sortText = label.replace(/[a-zA-Z]/g, (c) => {
                    if (/[a-z]/.test(c)) {
                        return `0${c}`;
                    } else {
                        return `1${c.toLowerCase()}`;
                    }
                });
            }

            this.mathCompletionsJSON = JSON.stringify(this.mathCompletions);
        });
    }

    // REF https://microsoft.github.io/monaco-editor/api/interfaces/monaco.languages.CompletionItemProvider.html#provideCompletionItems
    // REF [Vue3中使用Monaco Editor代码编辑器记录——主动触发代码补全功能](https://blog.csdn.net/sebeefe/article/details/126080413)
    async provideCompletionItems(model, position, context, token) {
        // const lineTextBefore = model.lineAt(position.line).text.substring(0, position.character);
        const lineTextBefore = model.getLineContent(position.lineNumber).substring(0, position.column - 1);
        console.log(lineTextBefore);

        let matches = lineTextBefore.match(/\\+$/);
        if (
            //// ends with an odd number of backslashes
            matches !== null
            && matches[0].length % 2 !== 0
        ) {
            /* ┌────────────────┐
               │ Math functions │
               └────────────────┘ */
            switch (mathEnvCheck(model, position)) {
                case 'inline':
                    console.log('inline');
                case 'display':
                    console.log('display');
                    // return this.mathCompletions;
                    return {
                        // suggestions: this.mathCompletions,
                        // suggestions: [...this.mathCompletions],
                        // suggestions: JSON.parse(JSON.stringify(this.mathCompletions)),
                        suggestions: this.suggestions(),
                    };
                default:
                    return {
                        suggestions: [],
                    };
            }
        }
        else {
            return {
                suggestions: [],
            };
        }
    }
}
