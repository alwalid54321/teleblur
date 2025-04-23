# Telegram Web Privacy Blur

A browser extension that enhances privacy when using Telegram Web by blurring sensitive content until hovered or clicked.

## Features

- **Privacy Protection**: Blurs profile pictures, chat names, messages, and timestamps
- **Customizable Blur Levels**: Adjust blur intensity to your preference
- **Hover or Click to Reveal**: Choose between revealing content on hover or requiring a click
- **PIN Protection**: Optionally set a PIN to unlock blurred content
- **Keyboard Shortcut**: Toggle all blur on/off with Ctrl+Shift+B
- **Domain Whitelist**: Exclude specific domains from blur effect
- **Context Menu Integration**: Right-click to toggle blur on specific elements
- **Multilingual Support**: Available in English and Arabic

## Installation

### Chrome/Edge/Brave

1. Download the latest release from the [Releases page](https://github.com/username/telegram-blur-extension/releases)
2. Extract the ZIP file to a folder
3. Open your browser and go to the extensions page:
   - Chrome: `chrome://extensions/`
   - Edge: `edge://extensions/`
   - Brave: `brave://extensions/`
4. Enable "Developer mode" (toggle in the top-right)
5. Click "Load unpacked" and select the extracted folder

### Firefox

1. Download the Firefox version from the [Releases page](https://github.com/username/telegram-blur-extension/releases)
2. Open Firefox and go to `about:addons`
3. Click the gear icon and select "Install Add-on From File..."
4. Select the downloaded .xpi file

## Usage

1. Navigate to [Telegram Web](https://web.telegram.org/)
2. The extension will automatically blur sensitive content
3. Hover over or click (depending on settings) to reveal content
4. Use the context menu (right-click) for additional options
5. Press Ctrl+Shift+B to quickly toggle all blur on/off
6. Click on the extension icon to access settings

## New in Version 1.2.0

- Added Arabic localization
- Improved hover effect for chat names
- Reduced border radius for profile pictures
- Added popup access to settings from toolbar icon
- Performance optimizations
- Better handling of dynamic content

## Privacy

This extension:
- Works entirely client-side
- Does not collect or transmit any data
- Requires minimal permissions (only for Telegram Web)
- Is fully open source

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details. 