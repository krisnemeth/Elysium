#!/usr/bin/env bash
# Converts the official Dark Pack EPS/AI artwork in brand-assets/ into
# optimised, recolourable SVGs in app/ui/svgs/official/.
# Requires: ghostscript (gs), poppler (pdftocairo), python3, npx (svgo).
set -euo pipefail
cd "$(dirname "$0")/.."

SRC="brand-assets/World of Darkness Community Assets/Vampire The Masquerade"
OUT="app/ui/svgs/official"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

# output path (relative to $OUT) | source path (relative to $SRC)
MAP="
clans/banu-haqim.svg|Clans - Vampire The Masquerade/Banu Haqim/BanuHaqim_Symbol.eps
clans/brujah.svg|Clans - Vampire The Masquerade/Brujah/VTM_Brujah_Symbol.eps
clans/caitiff.svg|Clans - Vampire The Masquerade/Caitiff/Caitiff_Symbol.eps
clans/gangrel.svg|Clans - Vampire The Masquerade/Gangrel/Gangrel_Symbol.eps
clans/hecata.svg|Clans - Vampire The Masquerade/Hecata/Hecata_Symbol_Modern.eps
clans/lasombra.svg|Clans - Vampire The Masquerade/Lasombra/Lasombra_symbol.eps
clans/malkavian.svg|Clans - Vampire The Masquerade/Malkavian/VTM_Malkavian_icon_black.eps
clans/ministry.svg|Clans - Vampire The Masquerade/The Ministry/MinistrySymbol.eps
clans/nosferatu.svg|Clans - Vampire The Masquerade/Nosferatu/Nosferatu_Symbol.eps
clans/ravnos.svg|Clans - Vampire The Masquerade/Ravnos/Ravnos_Symbol.eps
clans/salubri.svg|Clans - Vampire The Masquerade/Salubri/Salubri_Symbol.eps
clans/thin-blood.svg|Clans - Vampire The Masquerade/Thinblood/Thinblood_Symbol.eps
clans/toreador.svg|Clans - Vampire The Masquerade/Toreador/Toreador_Symbol.eps
clans/tremere.svg|Clans - Vampire The Masquerade/Tremere/Tremere_Symbol.eps
clans/tzimisce.svg|Clans - Vampire The Masquerade/Tzimisce/Tzimisce_Symbol.eps
clans/ventrue.svg|Clans - Vampire The Masquerade/Ventrue/Ventrue_Symbol.eps
clan-names/banu-haqim.svg|Clans - Vampire The Masquerade/Banu Haqim/BanuHaqim_TypeLogo.eps
clan-names/brujah.svg|Clans - Vampire The Masquerade/Brujah/VTM_Brujah_TypeLogo.eps
clan-names/gangrel.svg|Clans - Vampire The Masquerade/Gangrel/VTM_Gangrel_TypeLogo.eps
clan-names/hecata.svg|Clans - Vampire The Masquerade/Hecata/Hecata_TypeLogo.eps
clan-names/lasombra.svg|Clans - Vampire The Masquerade/Lasombra/Lasombra_TypeLogo.eps
clan-names/malkavian.svg|Clans - Vampire The Masquerade/Malkavian/VTM_Malkavian_type_black.eps
clan-names/ministry.svg|Clans - Vampire The Masquerade/The Ministry/TheMinistry_TypeLogo.eps
clan-names/nosferatu.svg|Clans - Vampire The Masquerade/Nosferatu/VTM_Nosferatu_type_black.eps
clan-names/ravnos.svg|Clans - Vampire The Masquerade/Ravnos/Ravnos_TypeLogo.eps
clan-names/salubri.svg|Clans - Vampire The Masquerade/Salubri/Salubri_TextLogo.eps
clan-names/toreador.svg|Clans - Vampire The Masquerade/Toreador/Toreador_TypeLogo.eps
clan-names/tremere.svg|Clans - Vampire The Masquerade/Tremere/VTM_Tremere_TypeLogo.eps
clan-names/tzimisce.svg|Clans - Vampire The Masquerade/Tzimisce/Tzimisce_TypeLogo.eps
clan-names/ventrue.svg|Clans - Vampire The Masquerade/Ventrue/VTM_Ventrue_TypeLogo.eps
sects/anarch.svg|Factions - Vampire The Masquerade/Anarch/AnachAnkh1.eps
sects/anarch-name.svg|Factions - Vampire The Masquerade/Anarch/VTM_Anarch_type_black.eps
sects/camarilla.svg|Factions - Vampire The Masquerade/Camarilla/VTM_Camarilla_ankh_black.eps
sects/camarilla-name.svg|Factions - Vampire The Masquerade/Camarilla/VTM_Camarilla_type_black.eps
sects/sabbat.svg|Factions - Vampire The Masquerade/Sabbat/Sabbat_Symbol.eps
sects/sabbat-name.svg|Factions - Vampire The Masquerade/Sabbat/SABBAT_text.eps
disciplines/animalism.svg|Disciplines - Vampire The Masquerade/Animalism rombo.ai
disciplines/auspex.svg|Disciplines - Vampire The Masquerade/Auspex rombo.ai
disciplines/blood-sorcery.svg|Disciplines - Vampire The Masquerade/Thaumaturgy rombo.ai
disciplines/celerity.svg|Disciplines - Vampire The Masquerade/Celerity rombo.ai
disciplines/dominate.svg|Disciplines - Vampire The Masquerade/Dominate rombo.ai
disciplines/fortitude.svg|Disciplines - Vampire The Masquerade/Fortitude rombo.ai
disciplines/obfuscate.svg|Disciplines - Vampire The Masquerade/Obfuscate rombo.ai
disciplines/oblivion.svg|Disciplines - Vampire The Masquerade/Oblivion rombo.ai
disciplines/potence.svg|Disciplines - Vampire The Masquerade/Potence rombo.ai
disciplines/presence.svg|Disciplines - Vampire The Masquerade/Presence rombo.ai
disciplines/protean.svg|Disciplines - Vampire The Masquerade/Protean rombo.ai
disciplines/thin-blood-alchemy.svg|Disciplines - Vampire The Masquerade/Thinblood_alchemy.ai
dice/bestial-failure.svg|Dice Symbols - Vampire The Masquerade/BestialFail.eps
dice/critical.svg|Dice Symbols - Vampire The Masquerade/Crit.eps
dice/messy-critical.svg|Dice Symbols - Vampire The Masquerade/MessyCrit.eps
dice/skull-teeth.svg|Dice Symbols - Vampire The Masquerade/SkullTeeth.eps
dice/success.svg|Dice Symbols - Vampire The Masquerade/Success.eps
dice/teeth.svg|Dice Symbols - Vampire The Masquerade/Teeth.eps
logos/ankh.svg|Ankhs - Vampire The Masquerade/VtM_ankh.eps
logos/vampire.svg|Logos - Vampire The Masquerade/VampireLogoBIG.eps
logos/vampire-long.svg|Logos - Vampire The Masquerade/VampireLongLogo.eps
"

rm -rf "$OUT"
echo "$MAP" | while IFS='|' read -r out src; do
  [ -z "$out" ] && continue
  mkdir -p "$OUT/$(dirname "$out")"
  pdf="$TMP/$(echo "$out" | tr / _).pdf"
  case "$src" in
    *.eps) gs -q -dNOPAUSE -dBATCH -dSAFER -dEPSCrop -sDEVICE=pdfwrite -o "$pdf" "$SRC/$src" ;;
    *.ai)  cp "$SRC/$src" "$pdf" ;;
  esac
  pdftocairo -svg "$pdf" "$OUT/$out"
done

python3 scripts/recolor-svgs.py "$OUT"
npx -y svgo@3 --quiet -r -f "$OUT" --config scripts/svgo.config.mjs
python3 scripts/write-official-index.py
echo "Converted $(find "$OUT" -name '*.svg' | wc -l | tr -d ' ') SVGs into $OUT"
