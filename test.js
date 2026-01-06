import { Resend } from 'resend';
const resend = new Resend('re_NEwZHH81_55krhVkyax26S9QP5nSX9uhL');

const { data, error } = await resend.emails.send({
  from: 'onboarding@resend.dev', // Resend's test domain
  to: 'patrickhag09@gmail.com',
  subject: 'hello world',
  html: '<strong>it works!</strong>',
});

if (error) {
  console.error({ error });
}

console.log(`Emaill ${data?.id} with customer HTML content has been sent.`);
