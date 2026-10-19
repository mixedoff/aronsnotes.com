/**
 * Note addresses, shared by the app and the build script that writes the
 * sitemap, the RSS feed and the list of pages to prerender.
 */

interface Sluggable {
  id: number;
  title: string;
  slug?: string;
}

/** 'nobody googles anymore. right?' -> 'nobody-googles-anymore-right' */
export function slugify(title: string): string {
  return title
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '') // accents
    .toLowerCase()
    .replace(/['’]/g, '') // let's -> lets
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** Gives every note its own slug; older notes keep theirs if a newer one has the same title */
export function assignSlugs<T extends Sluggable>(notes: T[]): T[] {
  const taken = new Set<string>();
  [...notes]
    .sort((a, b) => a.id - b.id)
    .forEach((note) => {
      const base = note.slug || slugify(note.title) || `note-${note.id}`;
      let slug = base;
      for (let n = 2; taken.has(slug); n++) slug = `${base}-${n}`;
      note.slug = slug;
      taken.add(slug);
    });
  return notes;
}
