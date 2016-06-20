'use strict';

import SearchPage from './pages/search/search-page';
import SavedPage from './pages/saved/saved-page';
import CameraPage from './pages/camera/camera-page';
import OrchidsDetailPage from './pages/orchids/orchids-detail-page';

export default {
    camera: {
        id: 'camera',
        title: 'Ler QR Code',
        component: CameraPage,
        onMenu: true,
        icon: 'camera',
    },
    saved: {
        id: 'saved',
        title: 'Orquídeas Salvas',
        component: SavedPage,
        onMenu: true,
        icon: 'favoriteFilled',
    },
    'orchids-detail': {
        id: 'orchidDetail',
        title: 'Detalhes',
        component: OrchidsDetailPage,
        onMenu: false,
        showNav: false,
    }
};
