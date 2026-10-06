// src/utils/tokenizer.ts

import {
  encode,
  decode,
} from "gpt-tokenizer/encoding/o200k_base";

import type {
  Token,
} from "../types/simulation";

export const TOKENIZER_ENCODING =
  "o200k_base";

/**
 * Converts text into real BPE token IDs.
 *
 * The token text displayed in the UI is reconstructed
 * by decoding each individual token ID.
 */
export function tokenizeDemo(
  text: string,
): Token[] {
  const tokenIds =
    encode(text);

  return tokenIds.map(
    (id, index) => {
      const tokenText =
        decode([id]);

      return {
        text: tokenText,

        index,

        id,

        length:
          tokenText.length,

        type:
          getTokenType(
            tokenText,
          ),
      };
    },
  );
}

function getTokenType(
  text: string,
): Token["type"] {
  if (
    text.length === 0
  ) {
    return "punctuation";
  }

  if (
    /^\s+$/.test(text)
  ) {
    return "space";
  }

  if (
    /^[\p{P}\p{S}]+$/u.test(
      text,
    )
  ) {
    return "punctuation";
  }

  return "word";
}