# Frontend Dependencies Security Audit Report
Date: June 2025

## Executive Summary
An audit of npm packages used in the frontend part of the project has been conducted. The audit shows that our dependencies are secure, with only low-severity issues found in development dependencies. All production dependencies meet security standards.

## 1. Current State Analysis

### 1.1 npm audit Results
```bash
# npm audit summary
- 10 low severity vulnerabilities (in dev dependencies)
- 0 moderate severity vulnerabilities
- 0 high severity vulnerabilities
- 0 critical severity vulnerabilities
```

### 1.2 Core Production Dependencies
| Package | Version | Security Status |
|---------|---------|-----------------|
| antd | 5.24.7 | ✅ Secure |
| axios | 1.8.4 | ✅ Secure |
| lodash | 4.17.21 | ✅ Secure |
| mobx | 6.13.7 | ✅ Secure |
| react | 19.0.0 | ✅ Secure |
| react-router-dom | 7.5.1 | ✅ Secure |
| wavesurfer.js | 7.9.4 | ✅ Secure |
| zod | 3.25.49 | ✅ Secure |

### 1.3 Development Dependencies Issues
- Found in: typescript-eslint ecosystem
- Severity: Low
- Impact: Development environment only
- Fix available through `npm audit fix`

## 2. Security Assessment

### 2.1 Zero-Day Vulnerabilities Protection
Currently implemented measures to minimize zero-day vulnerability risks:

1. **Active Monitoring**
   - GitHub Security Alerts enabled
   - Regular npm audit checks
   - Dependabot alerts configured

2. **Version Control**
   - Fixed version ranges in package.json
   - Manual review of dependency updates
   - Staging environment testing

3. **Security Best Practices**
   - Using official npm registry only
   - Regular dependency updates
   - Code review for package.json changes

## 3. Package Replacement Proposal

> For detailed migration plan and technical analysis, see [ADR-006: Migration from Axios to Ky HTTP Client](../adr/adr-006-http-client-migration.md)

### 3.1 Current vs Proposed Package

**Current: axios v1.8.4**
- Bundle size: ~32KB
- Multiple dependencies
- Partial TypeScript support

**Proposed: ky**
- Bundle size: ~13KB
- Minimal dependencies
- Full TypeScript support
- Built on modern Fetch API

### 3.2 Security Benefits
1. Smaller attack surface (13KB vs 32KB)
2. Fewer dependencies = fewer potential vulnerabilities
3. Modern Fetch API = native browser security
4. Active maintenance and security updates

## 4. Recommendations

### 4.1 Immediate Actions
1. Run `npm audit fix` for development dependencies
2. Review and update outdated packages
3. Begin planning axios to ky migration

### 4.2 Ongoing Security Measures
1. Weekly npm audit checks
2. Review security alerts from GitHub
3. Regular dependency updates

## 5. Conclusion
Production dependencies are secure with no known vulnerabilities. The development dependencies have low-severity issues that can be resolved through standard updates. The proposed migration to ky will further improve our security posture.

---
Date: June 2025