import React from "react";

function extractHeadings(markdown) {
  return markdown
    .split('\n')
    .filter(line => /^#{1,6}\s/.test(line))
    .map(line => {
      const level = line.match(/^#+/)[0].length;
      const text = line.replace(/^#+\s/, '');
      return { level, text };
    });
}

const TableOfContents = ({ markdown }) => {
  const headings = extractHeadings(markdown);

  return (
    <nav className="mb-4">
      <ul>
        {headings.map((h, i) => (
          <li key={i} style={{ marginLeft: (h.level - 1) * 16 }}>
            <a href={`#${h.text.replace(/\s+/g, '-').toLowerCase()}`}>{h.text}</a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default TableOfContents;