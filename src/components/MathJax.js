import React, { useState, useCallback } from 'react';
import { View } from 'react-native';
import { WebView } from 'react-native-webview';

const defaultOptions = {
    messageStyle: 'none',
    extensions: ['tex2jax.js'],
    jax: ['input/TeX', 'output/HTML-CSS'],
    tex2jax: {
        inlineMath: [['$', '$'], ['\\(', '\\)']],
        displayMath: [['$$', '$$'], ['\\[', '\\]']],
        processEscapes: true,
    },
    TeX: {
        extensions: ['AMSmath.js', 'AMSsymbols.js', 'noErrors.js', 'noUndefined.js'],
    },
};

export default function MathJax(props) {
    const [height, setHeight] = useState(1);

    const handleMessage = useCallback((message) => {
        setHeight(Number(message.nativeEvent.data));
    });

    const options = JSON.stringify({ ...defaultOptions, ...props.mathJaxOptions });

    const html = `
            <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
            <script type="text/x-mathjax-config">
                MathJax.Hub.Config(${options});

                MathJax.Hub.Queue(function() {
                    var height = document.documentElement.scrollHeight;
                    window.ReactNativeWebView.postMessage(String(height));
                    document.getElementById("formula").style.visibility = '';
                });
            </script>

            <script src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.0/MathJax.js"></script>
            <div id="formula" style="visibility: hidden;">
                ${props.html}
            </div>
        `;

    return (
        <View style={{ height, ...props.style }}>
            <WebView
                scrollEnabled={false}
                onMessage={handleMessage}
                source={{ html }}
                {...props}
            />
        </View>
    );
}
