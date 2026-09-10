/* HashPassword vamos a usar hashing de creacion y verificacion */
async function hashPassword(plainPassword) {
    const salt = await dcodeIO.bcrypt.genSalt(10);
    const hash = await dcodeIO.bcrypt.hash(plainPassword, salt);
    return hash;
}

/* Comparacion de contraseñas para vefificar la correcta */

async function comparePassword(plainPassword, hash) {
    const isMatch = await dcodeIO.bcrypt.compare(plainPassword, hash);
    return isMatch;
}