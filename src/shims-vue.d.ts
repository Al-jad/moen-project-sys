declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

declare module '@/components/ui/input';
declare module '@/components/ui/label';
declare module '@/stores/regionalProjectStore';
declare module '@/components/ui/dialog';
declare module '@/components/ui/button';
declare module '@/components/ui/badge';
declare module '@/plugins/axios';
