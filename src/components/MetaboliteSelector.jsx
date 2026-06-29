import { useState } from "react";

const METABOLITES = {
  "Neurotransmitters": [
    "Dopamine",
    "GABA",
    "Glutamate",
    "Serotonin",
    "Norepinephrine",
  ],
  "Amino Acids": [
    "Tyrosine",
    "Phenylalanine",
    "Tryptophan",
    "Glutamine",
    "Glycine",
    "Alanine",
  ],
  "Energy Metabolism": [
    "Lactate",
    "Pyruvate",
    "ATP",
    "Creatine",
    "Glucose",
    "NAD+",
  ],
  "Oxidative Stress": ["Glutathione", "Uric Acid", "8-OHdG"],
  "Lipids": ["Ceramide", "Sphingomyelin", "Phosphatidylcholine", "Cholesterol"],
  "PD-Specific": [
    "Alpha-synuclein",
    "DOPAC",
    "Homovanillic Acid",
    "3-Methoxytyramine"
  ],
};

const TAG_COLOURS = [
  { bg: "rgba(255, 68, 68, 0.15)", border: "#ff4444", text: "#ff6666" },
  { bg: "rgba(255, 170, 0, 0.15)", border: "#ffaa00", text: "#ffbb33" },
  { bg: "rgba(0, 200, 150, 0.15)", border: "#00c896", text: "#00e0a8" },
  { bg: "rgba(100, 160, 255, 0.15)", border: "#64a0ff", text: "#88bbff" },
  { bg: "rgba(200, 100, 255, 0.15)", border: "#c864ff", text: "#d888ff" },
  { bg: "rgba(255, 130, 80, 0.15)", border: "#ff8250", text: "#ff9970" },
];

function getTagColour(index) {
  return TAG_COLOURS[index % TAG_COLOURS.length];
}

export function MetaboliteSelector({ onSelectionChange }) {
  const [selected, setSelected] = useState([]);
  const [openGroups, setOpenGroups] = useState(
    Object.fromEntries(Object.keys(METABOLITES).map((k) => [k, true]))
  );

  const toggle = (metabolite) => {
    const next = selected.includes(metabolite)
      ? selected.filter((m) => m !== metabolite)
      : [...selected, metabolite];
    setSelected(next);
    onSelectionChange?.(next);
  };

  const remove = (metabolite) => {
    const next = selected.filter((m) => m !== metabolite);
    setSelected(next);
    onSelectionChange?.(next);
  };

  const toggleGroup = (group) => {
    setOpenGroups((prev) => ({ ...prev, [group]: !prev[group] }));
  };

  return (
    <div style={styles.container}>
      {selected.length > 0 && (
        <div style={styles.tagStrip}>
          <span style={styles.tagStripLabel}>Active:</span>
          <div style={styles.tagList}>
            {selected.map((m, i) => {
              const c = getTagColour(i);
              return (
                <span
                  key={m}
                  style={{
                    ...styles.tag,
                    background: c.bg,
                    borderColor: c.border,
                  }}
                >
                  <span style={{ color: c.text }}>{m}</span>
                  <button
                    style={styles.tagX}
                    onClick={() => remove(m)}
                    title={`Remove ${m}`}
                  >
                    ×
                  </button>
                </span>
              );
            })}
          </div>
          {selected.length > 1 && (
            <button
              style={styles.clearAll}
              onClick={() => {
                setSelected([]);
                onSelectionChange?.([]);
              }}
            >
              Clear all
            </button>
          )}
        </div>
      )}

      <div style={styles.groups}>
        {Object.entries(METABOLITES).map(([group, items]) => (
          <div key={group} style={styles.group}>
            <button
              style={styles.groupHeader}
              onClick={() => toggleGroup(group)}
            >
              <span style={styles.groupName}>{group}</span>
              <span style={styles.groupChevron}>
                {openGroups[group] ? "▾" : "▸"}
              </span>
              <span style={styles.groupCount}>
                {items.filter((m) => selected.includes(m)).length}/
                {items.length}
              </span>
            </button>

            {openGroups[group] && (
              <div style={styles.items}>
                {items.map((metabolite) => {
                  const isSelected = selected.includes(metabolite);
                  const tagIndex = selected.indexOf(metabolite);
                  const colour = isSelected ? getTagColour(tagIndex) : null;
                  return (
                    <button
                      key={metabolite}
                      style={{
                        ...styles.item,
                        background: isSelected ? colour.bg : "transparent",
                        borderColor: isSelected ? colour.border : "transparent",
                        color: isSelected ? colour.text : "#777",
                      }}
                      onClick={() => toggle(metabolite)}
                    >
                      <span
                        style={{
                          ...styles.itemDot,
                          background: isSelected
                            ? colour?.text || "#555"
                            : "#333",
                          boxShadow: isSelected
                            ? `0 0 6px ${colour?.text}`
                            : "none",
                        }}
                      />
                      {metabolite}
                      {isSelected && <span style={styles.checkmark}>✓</span>}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
    fontFamily: "'DM Mono', 'Courier New', monospace",
    fontSize: 12,
    color: "#aaa",
  },
  tagStrip: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
    padding: "10px 12px",
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: 8,
  },
  tagStripLabel: {
    fontSize: 10,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    color: "#555",
  },
  tagList: {
    display: "flex",
    flexWrap: "wrap",
    gap: 6,
  },
  tag: {
    display: "inline-flex",
    alignItems: "center",
    gap: 5,
    padding: "3px 8px 3px 10px",
    borderRadius: 20,
    border: "1px solid",
    fontSize: 11,
    fontWeight: 500,
    letterSpacing: "0.02em",
  },
  tagX: {
    background: "none",
    border: "none",
    cursor: "pointer",
    color: "#888",
    fontSize: 14,
    lineHeight: 1,
    padding: "0 2px",
    display: "flex",
    alignItems: "center",
    transition: "color 0.15s",
  },
  clearAll: {
    alignSelf: "flex-start",
    background: "none",
    border: "1px solid #333",
    borderRadius: 4,
    color: "#555",
    cursor: "pointer",
    fontSize: 10,
    letterSpacing: "0.08em",
    padding: "3px 8px",
    textTransform: "uppercase",
    transition: "border-color 0.15s, color 0.15s",
  },
  groups: {
    display: "flex",
    flexDirection: "column",
    gap: 4,
  },
  group: {
    borderRadius: 6,
    overflow: "hidden",
    border: "1px solid rgba(255,255,255,0.05)",
  },
  groupHeader: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "8px 12px",
    background: "rgba(255,255,255,0.03)",
    border: "none",
    cursor: "pointer",
    color: "#888",
    textAlign: "left",
    transition: "background 0.15s",
  },
  groupName: {
    flex: 1,
    fontSize: 11,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    fontWeight: 600,
  },
  groupChevron: {
    fontSize: 10,
    color: "#444",
  },
  groupCount: {
    fontSize: 10,
    color: "#444",
    fontVariantNumeric: "tabular-nums",
  },
  items: {
    display: "flex",
    flexDirection: "column",
    gap: 1,
    padding: "4px 8px 8px",
    background: "rgba(0,0,0,0.2)",
  },
  item: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "6px 10px",
    background: "transparent",
    border: "1px solid transparent",
    borderRadius: 5,
    cursor: "pointer",
    color: "#777",
    fontSize: 12,
    textAlign: "left",
    transition: "all 0.15s",
    letterSpacing: "0.01em",
  },
  itemDot: {
    width: 6,
    height: 6,
    borderRadius: "50%",
    flexShrink: 0,
    transition: "all 0.2s",
  },
  checkmark: {
    marginLeft: "auto",
    fontSize: 10,
    opacity: 0.7,
  },
};

export default MetaboliteSelector;
