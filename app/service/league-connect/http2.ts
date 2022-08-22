import http2 from 'http2'
import type { IncomingHttpHeaders, IncomingHttpStatusHeader } from 'http2'
import fs from 'fs'
import path from 'path'
import { TextEncoder } from 'util'
import assert from 'assert'
import { trim } from './trim'
import type { Credentials } from './authentication'
import type { HeaderPair, HttpResponse, HttpRequestOptions, JsonObjectLike } from './request_types'

/**
 * Create a HTTP/2.0 client session.
 *
 * This invocation requires the credentials to have
 */
export async function createHttpSession(credentials: Credentials): Promise<http2.ClientHttp2Session> {
  const RIOT_GAMES_CERT = `-----BEGIN CERTIFICATE-----
  MIIEIDCCAwgCCQDJC+QAdVx4UDANBgkqhkiG9w0BAQUFADCB0TELMAkGA1UEBhMC
  VVMxEzARBgNVBAgTCkNhbGlmb3JuaWExFTATBgNVBAcTDFNhbnRhIE1vbmljYTET
  MBEGA1UEChMKUmlvdCBHYW1lczEdMBsGA1UECxMUTG9MIEdhbWUgRW5naW5lZXJp
  bmcxMzAxBgNVBAMTKkxvTCBHYW1lIEVuZ2luZWVyaW5nIENlcnRpZmljYXRlIEF1
  dGhvcml0eTEtMCsGCSqGSIb3DQEJARYeZ2FtZXRlY2hub2xvZ2llc0ByaW90Z2Ft
  ZXMuY29tMB4XDTEzMTIwNDAwNDgzOVoXDTQzMTEyNzAwNDgzOVowgdExCzAJBgNV
  BAYTAlVTMRMwEQYDVQQIEwpDYWxpZm9ybmlhMRUwEwYDVQQHEwxTYW50YSBNb25p
  Y2ExEzARBgNVBAoTClJpb3QgR2FtZXMxHTAbBgNVBAsTFExvTCBHYW1lIEVuZ2lu
  ZWVyaW5nMTMwMQYDVQQDEypMb0wgR2FtZSBFbmdpbmVlcmluZyBDZXJ0aWZpY2F0
  ZSBBdXRob3JpdHkxLTArBgkqhkiG9w0BCQEWHmdhbWV0ZWNobm9sb2dpZXNAcmlv
  dGdhbWVzLmNvbTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAKoJemF/
  6PNG3GRJGbjzImTdOo1OJRDI7noRwJgDqkaJFkwv0X8aPUGbZSUzUO23cQcCgpYj
  21ygzKu5dtCN2EcQVVpNtyPuM2V4eEGr1woodzALtufL3Nlyh6g5jKKuDIfeUBHv
  JNyQf2h3Uha16lnrXmz9o9wsX/jf+jUAljBJqsMeACOpXfuZy+YKUCxSPOZaYTLC
  y+0GQfiT431pJHBQlrXAUwzOmaJPQ7M6mLfsnpHibSkxUfMfHROaYCZ/sbWKl3lr
  ZA9DbwaKKfS1Iw0ucAeDudyuqb4JntGU/W0aboKA0c3YB02mxAM4oDnqseuKV/CX
  8SQAiaXnYotuNXMCAwEAATANBgkqhkiG9w0BAQUFAAOCAQEAf3KPmddqEqqC8iLs
  lcd0euC4F5+USp9YsrZ3WuOzHqVxTtX3hR1scdlDXNvrsebQZUqwGdZGMS16ln3k
  WObw7BbhU89tDNCN7Lt/IjT4MGRYRE+TmRc5EeIXxHkQ78bQqbmAI3GsW+7kJsoO
  q3DdeE+M+BUJrhWorsAQCgUyZO166SAtKXKLIcxa+ddC49NvMQPJyzm3V+2b1roP
  SvD2WV8gRYUnGmy/N0+u6ANq5EsbhZ548zZc+BI4upsWChTLyxt2RxR7+uGlS1+5
  EcGfKZ+g024k/J32XP4hdho7WYAS2xMiV83CfLR/MNi8oSMaVQTdKD8cpgiWJk3L
  XWehWA==
  -----END CERTIFICATE-----
  `
  const certificate = credentials.certificate ?? RIOT_GAMES_CERT

  return http2.connect(`https://127.0.0.1:${credentials.port}`, {
    ca: certificate
  })
}

export class Http2Response implements HttpResponse {
  public readonly ok: boolean
  public readonly redirected: boolean
  public readonly status: number

  public constructor(
    private _headers: IncomingHttpHeaders & IncomingHttpStatusHeader,
    private _stream: http2.ClientHttp2Stream,
    private _raw: string
  ) {
    assert(_stream.closed, 'Response constructor called with unclosed ClientHttp2Stream')
    const code = _headers[':status']!

    // See https://fetch.spec.whatwg.org/#statuses
    this.ok = code >= 200 && code < 300
    this.redirected = [301, 302, 303, 307, 308].includes(code)
    this.status = code
  }

  public json<T = JsonObjectLike>() {
    return JSON.parse(this._raw) as T
  }

  public text(): string {
    return this._raw
  }

  public headers(): HeaderPair[] {
    const headers: HeaderPair[] = []

    for (const [key, value] of Object.entries(this._headers)) {
      if (key.startsWith(':')) {
        continue
      }

      if (value === undefined) {
        headers.push([key, ''])
      } else if (Array.isArray(value)) {
        headers.push([key, value.join(', ')])
      } else {
        headers.push([key, value])
      }
    }

    return headers
  }
}

export async function createHttp2Request<T>(
  options: HttpRequestOptions<T>,
  session: http2.ClientHttp2Session,
  credentials: Credentials
): Promise<Http2Response> {
  assert(!session.closed, 'createHttp2Request called on closed session')
  const request = session.request({
    ':path': '/' + trim(options.url),
    ':method': options.method,
    Accept: 'application/json',
    'Content-Type': 'application/json',
    Authorization: 'Basic ' + Buffer.from(`riot:${credentials.password}`).toString('base64')
  })
  request.setEncoding('utf8')
  if (options.body) {
    const data = JSON.stringify(options.body)
    const body = new TextEncoder().encode(data)
    request.write(body, 'utf8')
  }

  return new Promise((resolve, reject) => {
    let bodyText = ''
    let headers: IncomingHttpHeaders & IncomingHttpStatusHeader
    request.on('response', (response) => {
      headers = response
    })
    request.on('data', (data) => void (bodyText += data))
    request.on('error', (err) => reject(err))
    request.on('end', () => {
      try {
        request.close()
        resolve(new Http2Response(headers, request, bodyText))
      } catch (jsonError) {
        reject(jsonError)
      }
    })
  })
}
