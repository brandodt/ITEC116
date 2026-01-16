import { Module, Global } from '@nestjs/common';

/**
 * Common Module
 * Contains shared utilities, guards, decorators, and pipes
 * Marked as @Global() so exports are available throughout the app
 */
@Global()
@Module({
  imports: [],
  providers: [],
  exports: [],
})
export class CommonModule {}
