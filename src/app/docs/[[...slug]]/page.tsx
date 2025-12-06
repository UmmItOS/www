import { source } from '@/lib/source';
import {
  DocsPage,
  DocsBody,
  DocsDescription,
  DocsTitle,
} from 'fumadocs-ui/page';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createRelativeLink } from 'fumadocs-ui/mdx';
import { getMDXComponents } from '@/mdx-components';
import { Icon } from '@iconify/react';

export default async function Page(props: {
  params: Promise<{ slug?: string[] }>;
}) {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  const MDXContent = page.data.body;

  return (
    <DocsPage toc={page.data.toc} full={page.data.full}>
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription>{page.data.description}</DocsDescription>
      <DocsBody>
        <MDXContent
          components={getMDXComponents({
            // this allows you to link to other pages with relative file paths
            a: createRelativeLink(source, page),
          })}
        />
      </DocsBody>
      <DocsBody>
        <div className="flex items-center justify-between mt-12 pt-6 border-t border-fd-border/60">
          <p className="text-xs text-fd-muted-foreground">
            Found an issue? submit a pull request! <br />Don&apos;t be shy, your help is making this documentation better for everyone.
          </p>
          <a
            href={`https://github.com/UmmItKin/ummit-docs/blob/master/content/docs/${page.path}`}
            rel="noreferrer noopener"
            target="_blank"
            className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-fd-muted-foreground bg-fd-muted/30 border border-fd-border rounded-lg transition-all duration-200 hover:bg-fd-accent hover:text-fd-accent-foreground group no-underline"
          >
            <Icon 
              icon="mdi:github" 
              className="w-4 h-4" 
            />
            Edit on GitHub
            <Icon 
              icon="lucide:external-link" 
              className="w-3 h-3 opacity-60" 
            />
          </a>
        </div>
      </DocsBody>
    </DocsPage>
  );
}

export async function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata(props: {
  params: Promise<{ slug?: string[] }>;
}): Promise<Metadata> {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  return {
    title: page.data.title,
    description: page.data.description,
  };
}
