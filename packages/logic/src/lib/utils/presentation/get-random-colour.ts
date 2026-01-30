
const COLORS = [
    'rgb(255, 231, 117)',
    'rgb(195, 241, 140)',
    'rgb(255, 177, 177)',
    'rgb(153, 220, 255)',
]
/**
 * 
 * @deprecated
 */
export const getRandomColour = () => {
    return COLORS[Math.floor(Math.random() * COLORS.length)]
}
