import { Context } from 'egg';
import * as OAuth2Server from 'oauth2-server';
import { AuthorizationCode, Token,
  AuthorizationCodeModel, ClientCredentialsModel, RefreshTokenModel, PasswordModel, ExtensionModel,
  AuthenticateOptions, AuthorizeOptions, ServerOptions, TokenOptions,
} from 'oauth2-server';

declare module 'egg' {
  export interface Application {
    oAuth2Server: OAuth2;
  }
}

type Model = AuthorizationCodeModel | ClientCredentialsModel | RefreshTokenModel | PasswordModel | ExtensionModel;
type ExecuteOptions = AuthenticateOptions | AuthorizeOptions | TokenOptions;
declare class OAuth2 {
  constructor(config: ServerOptions, model: Model);
  private config: ServerOptions;
  private model: Model;
  private server: OAuth2Server;

  /**
   * Authenticates a request.
   */
  public authenticate(options?: AuthenticateOptions): (ctx: Context, next: Function) => Promise<void>;
  /**
   * Authorizes a token request.
   */
  public authorize(options?: AuthorizeOptions): (ctx: Context, next: Function) => Promise<void>;
  /**
   * Retrieves a new token for an authorized token request.
   */
  public token(options?: TokenOptions): (ctx: Context, next: Function) => Promise<void>;

  private execute(handle: 'authenticate' | 'authorize' | 'token', ctx: Context, options: ExecuteOptions): Promise<AuthorizationCode | Token>;
}
