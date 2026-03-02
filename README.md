# Custom VS Code

Personal fork of Visual Studio Code with a Cursor-style horizontal activity bar and pitch black theme.

![VS Code](https://img.shields.io/badge/VS%20Code-1.110.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## What's Different

- **Horizontal Activity Bar** - Icons displayed horizontally at the top of the sidebar (like Cursor)
- **Pitch Black Theme** - True black backgrounds (#000000) with high contrast syntax highlighting
- **Dropdown Menu** - Manage and switch between views with a dropdown
- **Pin/Unpin Views** - Customize which views appear in the activity bar

## Quick Start

```bash
# Clone and setup
git clone <your-repo>
cd MY-vscode
npm install

# Build
npm run compile

# Run
./scripts/code.sh        # Linux/Mac
.\scripts\code.bat       # Windows
```

## Configuration

The custom theme and layout are active by default. To manually configure:

**Settings → Color Theme** → Select "Pitch Black"

Or add to `settings.json`:
```json
{
  "workbench.colorTheme": "Pitch Black",
  "workbench.activityBar.location": "top"
}
```

## Activity Bar Options

- `"top"` - Horizontal bar at top of sidebar (default)
- `"bottom"` - Horizontal bar at bottom of sidebar
- `"default"` - Traditional vertical left sidebar
- `"hidden"` - Hide activity bar

## Building for Distribution

See [DISTRIBUTION_GUIDE.md](DISTRIBUTION_GUIDE.md) for creating installers and portable builds.

```bash
# Linux
npm run gulp vscode-linux-x64

# Windows
npm run gulp vscode-win32-x64
```

## Development

```bash
# Watch mode (recommended)
npm run watch

# Run tests
./scripts/test.sh
./scripts/test-integration.sh
```

## Project Structure

- `src/vs/workbench/browser/parts/` - Activity bar and sidebar customizations
- `extensions/theme-defaults/themes/pitch_black.json` - Custom theme
- `CUSTOM_BUILD_GUIDE.md` - Detailed customization guide
- `EXTENSION_SUPPORT.md` - Extension compatibility info

## Modified Files

Key changes from upstream VS Code:

- Activity bar layout and positioning
- Sidebar composite bar with dropdown menu
- CSS styling for horizontal icon display
- Pitch black color theme

## Extensions

All standard VS Code extensions work. Extensions that add sidebar views automatically integrate with the horizontal activity bar.

## License

MIT - Based on [Visual Studio Code](https://github.com/microsoft/vscode) by Microsoft

## Contributing

This is a personal fork. For the official VS Code project, see [microsoft/vscode](https://github.com/microsoft/vscode).

---

**Note:** This is an independent fork and is not affiliated with or endorsed by Microsoft Corporation.
