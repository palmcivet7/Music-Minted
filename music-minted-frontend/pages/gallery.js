import styles from "../styles/Page.module.css"
import Footer from ".././components/Footer"
import NftGallery from "../components/NftGallery"

export default function GalleryPage() {
    return (
        <div className={styles.content} style={{ backgroundColor: "#ebf8ff" }}>
            {/* <div style={{ height: "100px" }} /> */}
            <h1 className={styles.subheading}>Gallery</h1>
            <NftGallery />
            <div style={{ height: "100px" }} />
            {/* <Paragraph /> */}
            <Footer />
        </div>
    )
}
