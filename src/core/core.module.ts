import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import * as path from 'path';
import { MailService } from './mail/mail.service';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: `smtps://pasharudiuk97@gmail.com:HsPQ0XmL1CZDN3T5@smtp-relay.sendinblue.com`,
      defaults: {
        from: '"nest-bonus" <september@nestjs.com>',
      },
      template: {
        dir: path.join(__dirname, '..', '..', '/templates'),
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class CoreModule {}
