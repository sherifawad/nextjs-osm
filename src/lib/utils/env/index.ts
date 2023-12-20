import { EnvCLientSchemaType } from "./clientEnvSchema";
import { EnvServerSchemaType } from "./serverEnvSchema";

declare global {
  namespace NodeJS {
    interface ProcessEnv extends EnvServerSchemaType, EnvCLientSchemaType {}
  }
}
