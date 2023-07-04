import { DefaultTheme } from 'vitepress';
import data from '../api/data.json';

enum Kind {
  Project = 1,
  Module = 2 << 0,
  Function = 2 << 5,
  Class = 2 << 6,
  Interface = 2 << 7,
  Type = 2 << 21
}

const KindToSlugMap = {
  [Kind.Module]: 'modules',
  [Kind.Function]: 'modules',
  [Kind.Class]: 'classes',
  [Kind.Interface]: 'interfaces',
  [Kind.Type]: 'modules'
}

interface Entry {
  name: string,
  kind: Kind,
  module?: string;
}

function parseSegment(name) {
  return name.replaceAll('/', '_').replaceAll('-', '_');
}

function slugForKind(kind: Kind) {
  return KindToSlugMap[kind];
}

function slug(path, entry: Entry) {
  const file = (entry: Entry) => {
    const parts = [];

    if (entry.module) {
      parts.push(parseSegment(entry.module) as never);
    }

    if (slugForKind(entry.kind) !== 'modules' || entry.kind === Kind.Module) {
      parts.push(parseSegment(entry.name) as  never);
    }

    return parts.join('.');
  }

  const segments = [path, slugForKind(entry.kind), file(entry)];

  let slug = `/${segments.join('/')}`;

  if (entry.kind === Kind.Function || entry.kind === Kind.Type) {
    slug += `#${entry.name.toLowerCase()}`;
  }

  return slug;
}

function getModuleChildren(data, path, module): DefaultTheme.SidebarItem[] {
  return data.map(entry => {
    return {
      text: entry.name,
      link: slug(path, { ...entry, module })
    }
  });
}

function getModules(data, path): DefaultTheme.SidebarItem[] {
  const modules: DefaultTheme.SidebarItem[] = data.children.map(entry => {
    const item: DefaultTheme.SidebarItem = {
      text: entry.name,
      link: slug(path, entry),
    };

    if (entry.children) {
      item.items = getModuleChildren(entry.children, path, entry.name);
    }

    return item;
  });

  return modules;
}

export function getSidebar(path): DefaultTheme.SidebarItem[] {
  return getModules(data, path);
}
