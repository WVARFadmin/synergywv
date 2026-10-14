// The WVARF lockup. On the navy header and session hero the reverse version
// is used — the navy lettering of the primary logo would vanish there, and
// the brand rules do not allow recolouring it ad hoc.
export function WvarfLogo({ height = 28, reverse = false, mark = false, className = '', alt = 'WVARF — West Virginia Association of Rehabilitation Facilities' }) {
  const src = mark
    ? (reverse ? '/assets/wvarf-mark-reverse.png' : '/assets/wvarf-mark.png')
    : (reverse ? '/assets/wvarf-logo-reverse.png' : '/assets/wvarf-logo.png');
  // Intrinsic sizes, so the browser reserves the right box before load.
  const ratio = mark ? 1 : 972 / 262;
  return (
    <span className={`wvarf-logo ${className}`.trim()}>
      <img
        src={src}
        alt={alt}
        height={height}
        width={Math.round(height * ratio)}
        style={{ height, width: 'auto', display: 'block' }}
      />
    </span>
  );
}
