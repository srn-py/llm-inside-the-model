<!-- README.md -->
# Inside the Model

An interactive digital science exhibit that lets users follow a prompt through a simplified language-model pipeline.

## What it demonstrates

The application presents one persistent prompt through these stages:

1. Human language
2. Tokenization
3. Token IDs
4. Embeddings
5. Positional information
6. Transformer layers
7. Self-attention
8. Logits
9. Probabilities
10. Next-token selection
11. Generation loop
12. Decoding

The default application runs entirely locally and requires no API key.

## Educational distinction

This application deliberately separates:

- actual input text
- demonstration tokenization
- illustrative token IDs
- simulated embeddings
- simulated attention
- simulated logits
- calculated probabilities
- simulated generation

The application does not claim that simulated values are extracted from a real production LLM.

## Run

```bash
npm install
npm run dev

