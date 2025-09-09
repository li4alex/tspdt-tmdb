import { useCollapse } from "react-collapsed";

const InfoBox = () => {
  const { getCollapseProps, getToggleProps, isExpanded } = useCollapse();

  return (
    <div class="info-button">
      <button {...getToggleProps()}>
        {isExpanded ? "Collapse" : "Info"}
      </button>
      <section {...getCollapseProps()}>
        <p>
        Best on desktop. Some columns will automatically hide when window width is reduced.
        </p>
        <p>
          Click on a column to sort by it. Click on the three dash menu icons to filter by that column. To reset a filter from blank/not blank, just select any other dropdown option and clear the text field.
        </p>
        <p>
          Provider data is sourced from The Movie Database, which does not provide direct streaming links.
        </p>
        <p>
          Movie titles are links to The Movie Database's country-specific streaming provider pages for the movies, which do have the relevant streaming links. If there is no link, there are no providers in that country.
        </p>
      </section>
    </div>
  )
}

export default InfoBox;