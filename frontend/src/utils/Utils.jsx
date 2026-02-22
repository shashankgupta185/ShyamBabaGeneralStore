import React from 'react'
import * as brotli from 'brotli-wasm';

const Utils = {

    convertToBase64: (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);

            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    },


    BrotliCompress: async (data) => {
        const encoder = new TextEncoder();
        const input = encoder.encode(data);

        const compressed = brotli.compress(input);
        return compressed;
    },

    BrotliDecompress: async (compressedData) => {
        debugger
        const decompressed = brotli.decompress(compressedData);

        const decoder = new TextDecoder();
        return decoder.decode(decompressed);
    },

}

export default Utils;
