module.exports.signUpErrors = (err) => {
  let errors = {pseudo: '', email: '', password: ''};
  if (err.message.includes('pseudo')) {
    errors.pseudo = "Pseudo incorrect";
  }
  if (err.message.includes('email')) {
    errors.email = "Email incorrect";
  }
  if (err.message.includes('password')) {
    errors.password = "Le mot de passe doit faire 6 caractères au minimum";
  }
  if (err.code === 11000 && Object.keys(err.keyValue)[0].includes('email')) {
    errors.email = "Cet email existe déjà";
  }
  if (err.code === 11000 && Object.keys(err.keyValue)[0].includes('pseudo')) {
    errors.email = "Ce pseudo existe déjà";
  }

  return errors;
}

module.exports.loginErrors = (err) => {
  let errors = {email: '', password: ''};
  if (err.message.includes('email')) {
    errors.email = "Email inconnu";
  }
  if (err.message.includes('password')) {
    errors.password = "Le mot de passe incorrect";
  }

  return errors;
}

module.exports.uploadErrors = (err) => {
  let errors = {format: '', maxSize: ''};
  if (err.message.includes('invalid file')) {
    errors.format = "Format invalide";
  }
  if (err.message.includes('max size')) {
    errors.maxSize = "Le fichier dépasse 500ko";
  }

  return errors;
}