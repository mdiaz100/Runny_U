import { configure } from '@serenity-js/core';
import { ConsoleReporter } from '@serenity-js/console-reporter';
import { SerenityBDDReporter } from '@serenity-js/serenity-bdd';
import { ArtifactArchiver } from '@serenity-js/core';
import { Photographer, TakePhotosOfFailures } from '@serenity-js/web';

configure({
  crew: [
    ConsoleReporter.withDefaultColourSupport(),
    SerenityBDDReporter.fromJSON({
      specDirectory: './e2e/features'
    }),
    ArtifactArchiver.storingArtifactsAt('./target/site/serenity'),
    Photographer.whoWill(TakePhotosOfFailures),
  ]
});

export default configure;