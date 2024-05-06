# Mdex: Markdown Frontmattter Index

A GitHub Action that generates a json index of frontmatter extracted from markdown files.

## Features

Creates a json index of frontmatter extracted from markdown files. The index is a dictionary of objects, each object representing the frontmatter of a file, with the relative path of each file as the key.

For example, given the following markdown files:

**file1.md**

```markdown
---
title: File 1
date: 2021-01-01
tags: [tag1, tag2]
---

# File 1

This is the content of file 1.
```

**dir/file2.md**

```markdown
---
title: File 2
date: 2021-01-02
tags: [tag2, tag3]
---

# File 2

This is the content of file 2.
```

The resulting index will be:

```json
{
  "file1.md": {
    "title": "File 1",
    "date": "2021-01-01",
    "tags": ["tag1", "tag2"]
  },
  "dir/file2.md": {
    "title": "File 2",
    "date": "2021-01-02",
    "tags": ["tag2", "tag3"]
  }
}
```

## Inputs

- `pattern`: The glob pattern matching the files to extract frontmatter from. Default: `**/*.md`.
- `output`: The path to write the index to. Default: `index.json`.

## Outputs

- `indexPath`: The path to the generated index file. 
- `json`: The json index objext as a string.

## Example usage

```yaml
- uses: actions/checkout@v3

- name: Create index of frontmatter
  uses: shmatt/mdex@v1
  with:
    pattern: "**/*.md"
    output: index.json

- name: Upload index.json to Api endpoint
  run: curl -X POST --fail -F frontMatter=@index.json https://example.com/api/frontmatter

- name: Upload index.json as an artifact
  uses: actions/upload-artifact@v3.1.2
  with:
    name: index.json
    path: index.json
```

## Contributing

Contributions are welcome! Please open an issue or a pull request.

