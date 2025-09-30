# Agile Tunnel – Starter

## Quick start
```bash
npm i
npm run dev
# open http://localhost:5173/render?component=AssetMetricSnapshot&preset=awareness/metric-1
```

## Asset Testing & Validation

### Validate All Assets
```bash
npm test
# Validates all preset and copy files, ensures schema compliance
```

### Test Live URLs (requires dev server running)
```bash
npm run test:url
# Tests actual HTTP endpoints to ensure assets load correctly
```

### Manual Testing URLs
```bash
# Cinematic style assets
http://localhost:5174/render?component=AssetMetricSnapshot&preset=awareness/cinematic-1
http://localhost:5174/render?component=AssetEMDExplainer&preset=awareness/cinematic-emd

# Original style assets  
http://localhost:5174/render?component=AssetMetricSnapshot&preset=awareness/metric-1
http://localhost:5174/render?component=AssetEMDExplainer&preset=awareness/emd-1
```

## Export examples
```bash
npm run export:png -- --component AssetMetricSnapshot --preset awareness/metric-1 --out out/img/metric-1.png
npm run export:pdf -- --component AssetEMDExplainer --preset awareness/emd-1 --out out/pdf/emd-1.pdf
```

> Ensure `npm run dev` (or `npm run preview`) is serving the app so Puppeteer can hit the URL.

## Troubleshooting

### Asset Not Loading
1. **Run validation**: `npm test` - checks file structure and schema compliance
2. **Check copy files**: Every preset needs a matching copy file with valid schema
3. **Verify component mapping**: Component name must exist in `src/Render.tsx`
4. **Check browser console**: Look for validation errors or 404s

### Common Issues
- **Missing copy file**: Create matching `.json` in `src/data/copy/awareness/`
- **Schema validation errors**: Check field names and types match `CopySchema` and `PresetSchema`
- **Component not found**: Verify component is imported and registered in `components` map

### File Structure Requirements
```
src/
  brand/presets/awareness/
    preset-name.json     # Component data
  data/copy/awareness/
    preset-name.json     # Copy content (must match CopySchema)
```
