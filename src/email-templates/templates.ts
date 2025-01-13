export const forgotPasswordTemplate = (user, resetPasswordURL) => {
  return `<!doctype html>
          <html>
            <body>
              <h1>Here is my custom email template!</h1>
              <p>Hello, ${user.email}!</p>
              <p>Click below to reset your password.</p>
              <p>
                <a href="${resetPasswordURL}">${resetPasswordURL}</a>
              </p>
            </body>
          </html>`;
};

export const verifyEmailTemplate = (user, url) => {
  return `<!doctype html>
          <html>
            <body>
              <h1>Please verify email!</h1>
              <p>Hello, ${user.email}!</p>
              <p>Click below to verify your email.</p>
              <p>
                <a href="${url}">${url}</a>
              </p>
            </body>
          </html>`;
};

// invite user after create User
export const inviteUserTemplate = (user, url, password) => {
  return `<!doctype html>
          <html>
            <body>
              <h1>Your account have been created!</h1>
              <p>Hello, ${user.email}!</p>
              <p>Click below to verify your email.</p>
              <p>
                <a href="${url}">${url}</a>
              </p>
            </body>
          </html>`;
};
