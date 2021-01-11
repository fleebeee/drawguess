const template = (
  app = '',
  styles = '',
  scripts = '<script src="dev_bundle.js"></script>',
  links = ''
) => `
<!DOCTYPE html>
<html>
  <head>
    <title>drawguess</title>
    <meta charset="utf-8">
    ${scripts}
    ${styles}
    ${links}
  </head>
  <body>
    <div id="root">${app}</div>
  </body>
</html>
`;

export default template;
