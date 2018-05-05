<?php include('header.tpl'); ?>
<form method="get">
<label>Bilatzailie: </label>
<br />
<input type="text" name="search" value="<?php echo $search; ?>"/>
<br />
<input type="submit" />
</form>
<br />
<?php echo $search_results; ?>
<?php include('footer.tpl'); ?>
