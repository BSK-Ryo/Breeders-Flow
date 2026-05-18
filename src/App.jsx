import { Footer, Header } from './components';
import { navigation, pageMetadata } from './data/siteContent.js';
import {
  AboutUs,
  Agreement,
  Beginner,
  Cancellation,
  Cases,
  Contact,
  Demo,
  FAQ,
  Features,
  Flow,
  Home,
  Line,
  LineManager,
  Migration,
  Pricing,
  Privacy,
  RequiredPages,
  Security,
  Support,
  Terms,
  Tokushoho,
} from './pages';

const routes = [
  [pageMetadata.home.path, Home],
  ['/beginner/', Beginner],
  [pageMetadata.features.path, Features],
  [pageMetadata.pricing.path, Pricing],
  [pageMetadata.demo.path, Demo],
  [pageMetadata.migration.path, Migration],
  [pageMetadata.faq.path, FAQ],
  [pageMetadata.contact.path, Contact],
  ['/flow/', Flow],
  ['/line/', Line],
  ['/line-guide/', Line],
  ['/required-pages/', RequiredPages],
  ['/cases/', Cases],
  ['/support/', Support],
  ['/security/', Security],
  [pageMetadata.lineManager.path, LineManager],
  [pageMetadata.about.path, AboutUs],
  ['/privacy/', Privacy],
  ['/terms/', Terms],
  ['/tokushoho/', Tokushoho],
  ['/cancellation/', Cancellation],
  ['/agreement/', Agreement],
];

const routeMap = new Map(routes.map(([path, Page]) => [normalizePath(path), Page]));
const metadataByPath = new Map(
  Object.values(pageMetadata).map((meta) => [normalizePath(meta.path), meta]),
);

function normalizePath(pathname) {
  const path = pathname || '/';
  if (path === '/') return path;
  return path.endsWith('/') ? path : `${path}/`;
}

function getCurrentPath() {
  if (typeof window === 'undefined') return '/';
  return normalizePath(window.location.pathname);
}

function NotFound() {
  return (
    <main className="min-h-[60vh] bg-[#FFFCF7] px-5 py-20 text-slate-800">
      <section className="mx-auto max-w-3xl text-center">
        <p className="text-sm font-black uppercase tracking-[.22em] text-[#0F766E]">404</p>
        <h1 className="mt-4 text-4xl font-black text-slate-900">ページが見つかりません</h1>
        <p className="mt-4 leading-7 text-slate-600">
          お探しのページは移動または削除された可能性があります。
        </p>
        <a
          href="/"
          className="mt-8 inline-flex rounded-full bg-[#0F766E] px-7 py-4 font-black text-white shadow-lg shadow-teal-900/10"
        >
          トップへ戻る
        </a>
      </section>
    </main>
  );
}

function App() {
  const currentPath = getCurrentPath();
  const Page = routeMap.get(currentPath) || NotFound;
  const meta = metadataByPath.get(currentPath);

  if (typeof document !== 'undefined' && meta) {
    document.title = meta.title || 'Breeders Flow';
    const description = document.querySelector('meta[name="description"]');
    if (description && meta.description) {
      description.setAttribute('content', meta.description);
    }
  }

  return (
    <div className="min-h-screen bg-[#FFFCF7] text-slate-800">
      <Header items={navigation} />
      <Page />
      <Footer />
    </div>
  );
}

export default App;
