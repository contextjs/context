/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

/*
    Diagnostic code ranges:
    1000–1999: Comment-related
    2000–2999: Markup-related
    3000–3999: Code/Transition
    9000–9999: General/Internal/Other
*/

import { StringExtensions } from "@contextjs/system";
import { DiagnosticMessage } from "./diagnostic-message.js";

export class DiagnosticMessages {
    public static readonly InvalidComment = new DiagnosticMessage(1000, "Invalid comment syntax");
    public static readonly UnterminatedComment = (endTag: string) => new DiagnosticMessage(1001, `Unterminated comment: missing ${endTag}`);

    public static readonly InvalidName = new DiagnosticMessage(2000, "Invalid name syntax.");
    public static readonly UnterminatedAttributeValue = new DiagnosticMessage(2001, "Unterminated attribute value.");
    public static readonly InvalidAttributeValue = new DiagnosticMessage(2002, "Invalid attribute value syntax.");
    public static readonly ExpectedEquals = new DiagnosticMessage(2003, "Expected '=' symbol after name.");
    public static readonly InvalidTagFormat = new DiagnosticMessage(2004, "Invalid tag format. Expected a name followed by optional attributes.");
    public static readonly ExpectedCDATAStart = new DiagnosticMessage(2005, "Expected start of the \"<![CDATA[\" tag.");
    public static readonly MissingCDATAEnd = new DiagnosticMessage(2006, "Missing CDATA section end (expected \"]]>\").");
    public static readonly InvalidTagName = (name: string) => new DiagnosticMessage(2007, `Invalid tag name: ${StringExtensions.removeLineBreaks(name)}. Tag names must start with a letter and can contain letters, digits, hyphens, underscores, and periods.`);
    public static readonly UnterminatedTag = (tagName: string) => new DiagnosticMessage(2008, `Unterminated tag: missing closing tag for <${StringExtensions.removeLineBreaks(tagName)}>.`);
    public static readonly MismatchedEndTag = (expectedTagName: string, tagName: string) => new DiagnosticMessage(2009, `Mismatched end tag: expected ${StringExtensions.removeLineBreaks(expectedTagName)}, but found ${StringExtensions.removeLineBreaks(tagName)}.`);
    public static readonly EmptyAttributeValue = new DiagnosticMessage(2010, "Empty attribute value is not allowed. Attribute values must be non-empty strings.");
    public static readonly ExpectedEndStyleTag = (name: string) => new DiagnosticMessage(2011, `Expected end of style tag (</style>), but found: ${StringExtensions.removeLineBreaks(name)}`);
    public static readonly ExpectedEndScriptTag = (name: string) => new DiagnosticMessage(2012, `Expected end of script tag (</script>), but found: ${StringExtensions.removeLineBreaks(name)}`);
    public static readonly UnterminatedDoctype = new DiagnosticMessage(2013, "Unterminated DOCTYPE identifier: missing closing '>' character.");

    public static readonly ExpectedTransitionMarker = (character: string) => new DiagnosticMessage(3000, `Expected a transition marker but found: ${StringExtensions.removeLineBreaks(character)}`);
    public static readonly ExpectedBracket = (character: string) => new DiagnosticMessage(3001, `Expected a bracket but found: ${StringExtensions.removeLineBreaks(character)}`);
    public static readonly ExpectedBrace = (character: string) => new DiagnosticMessage(3002, `Expected a brace but found: ${StringExtensions.removeLineBreaks(character)}`);
    public static readonly NoWhitespaceAfterTransition = new DiagnosticMessage(3003, "No whitespace allowed after transition marker.");
    public static readonly MalformedCodeBlock = new DiagnosticMessage(3004, "Malformed code block. Expected a valid code block syntax.");
    public static readonly UnexpectedTransition = new DiagnosticMessage(3005, `Unexpected transition.`);
    public static readonly UnexpectedCodeBlock = new DiagnosticMessage(3006, `Unexpected code block inside a code block. Nested code blocks are not allowed. You can use inline code instead.`);

    public static readonly UnexpectedEndOfInput = new DiagnosticMessage(9000, "Unexpected end of input.");
    public static readonly UnsupportedLanguage = new DiagnosticMessage(9001, "Unsupported language.");
    public static readonly UnsupportedProjectType = (projectType: string) => new DiagnosticMessage(9002, `Unsupported project type: '${projectType}'.`);
    public static readonly FileNotFound = (filePath: string) => new DiagnosticMessage(9003, `File not found: ${filePath}`);
    public static readonly UnknownCompilationContextFile = (filePath: string) => new DiagnosticMessage(9004, `Unknown compilation context file: ${filePath}`);
}