import DE from '../lang/de.json'

var T = {
 'DE':DE
}

export function translate (path) {
 return T['DE'][path]
}

