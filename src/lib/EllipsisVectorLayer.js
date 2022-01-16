import { VectorLayerUtil } from 'ellipsis-js-util';

class EllipsisVectorLayer extends VectorLayerUtil.EllipsisVectorLayerBase {

    loadingOptions = {
        styleKeys: {
            radius: [],
            weight: ['width'],
            color: ['borderColor'],
            opacity: [],
            fillColor: [],
            fillOpacity: []
        }
    }

    constructor(options = {}) {
        super(options);

        this.leafletLayer = L.geoJSON([], {
            style: (feature) => feature.properties.compiledStyle,
            markersInheritOptions: true,
            interactive: !!this.options.onFeatureClick,
            onEachFeature: this.options.onFeatureClick ? (feature, layer) => {
                layer.on('click', (e) => this.options.onFeatureClick(feature, layer));
            } : undefined,
            pointToLayer: this.pointFeatureToLayer,
        });

        this.leafletLayer.on("add", this.handleAddedToMap);
        this.printedFeatureIds = [];
    }

    addTo = (map) => this.leafletLayer.addTo(map);
    getLeafletLayer = () => this.leafletLayer;

    handleAddedToMap = () => {
        this.update();

        if (this.options.loadAll) return;

        this.leafletLayer._map.on("zoom", (x) => {
            this.update();
        });

        this.leafletLayer._map.on("moveend", (x) => {
            this.update();
        });

        this.leafletLayer._map.on("remove", (x) => {
            await this.clearLayer();
        });
    }

    pointFeatureToLayer = (feature, latlng) => {
        if (this.options.useMarkers) {
            const icon = new L.Icon.Default();
            icon.options.shadowSize = [0, 0];
            return new L.marker(latlng, { icon });
        }

        return L.circleMarker(latlng, {
            radius: feature.properties.radius,
            color: feature.properties.color,
            fillColor: feature.properties.color,
            fillOpacity: feature.properties.fillOpacity,
            opacity: 1,
            weight: feature.properties.weight,
            interactive: this.options.onFeatureClick ? true : false
        });

    }

    updateView = () => {
        const features = this.getFeatures();
        console.log(features);
        if (!this.printedFeatureIds.length)
            this.leafletLayer.clearLayers();
        this.leafletLayer.addData(features.filter(x => !this.printedFeatureIds.includes(x.properties.id)));
        features.forEach(x => this.printedFeatureIds.push(x.properties.id));
    };

    getMapBounds = () => {
        const leafletMap = this.leafletLayer._map;
        if (!leafletMap || !leafletMap._zoom) return;

        const screenBounds = leafletMap.getBounds();

        let bounds = {
            xMin: screenBounds.getWest(),
            xMax: screenBounds.getEast(),
            yMin: screenBounds.getSouth(),
            yMax: screenBounds.getNorth(),
        };

        return { bounds: bounds, zoom: leafletMap._zoom };
    };
}

export default EllipsisVectorLayer;