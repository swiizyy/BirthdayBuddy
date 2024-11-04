// Unless explicitly defined, set NODE_ENV as development:
process.env.NODE_ENV ??= 'development';

import '@sapphire/plugin-logger/register';

import { PrismaClient } from '@prisma/client';
import { ApplicationCommandRegistries, container, RegisterBehavior } from '@sapphire/framework';
import { setup } from '@skyra/env-utilities';
import * as colorette from 'colorette';
import { join } from 'node:path';
import { srcDir } from './constants';

// Set default behavior to bulk overwrite
ApplicationCommandRegistries.setDefaultBehaviorWhenNotIdentical(RegisterBehavior.BulkOverwrite);

// Read env var
setup({ path: join(srcDir, '.env') });

// Enable colorette
colorette.createColors({ useColor: true });

// Prisma setup
const prisma = new PrismaClient();
container.prisma = prisma;

declare module '@sapphire/framework' {
	interface Container {
		prisma: PrismaClient;
	}
}
