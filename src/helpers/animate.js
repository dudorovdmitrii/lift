export const startAnimation = async (element, keyFrames, options) => {
    return new Promise((resolve, reject) => {
        try {
            const animation = element.animate(keyFrames, options)
            const listenerFunction = () => {
                animation.removeEventListener('finish', listenerFunction)
                resolve()
            }
            animation.addEventListener('finish', listenerFunction)
        }
        catch (err) {
            reject(err)
        }
    })
}

export const dispatchAnimation = (element, keyFrames, options) => {
    return () => animate(element, keyFrames, options)
}